import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProposalsRepository } from './proposals.repository';
import { NetworkService } from '../network/network.service';
import { CommissionsService } from '../commissions/commissions.service';
import { JourneyService } from '../journey/journey.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ProposalStatus } from '@prisma/client';

@Injectable()
export class ProposalsService {
  constructor(
    private prisma: PrismaService,
    private repository: ProposalsRepository,
    private networkService: NetworkService,
    private commissionsService: CommissionsService,
    private journeyService: JourneyService,
    private notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateProposalDto) {
    if (dto.idempotencyKey) {
      const existing = await this.repository.findByIdempotencyKey(dto.idempotencyKey);
      if (existing) return existing;
    }
    const profile = await this.prisma.profile.findUnique({
      where: { id: dto.profileId },
      include: { user: true },
    });
    if (!profile) throw new NotFoundException('Perfil nao encontrado');
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Produto nao encontrado');
    return this.repository.create({
      profile: { connect: { id: dto.profileId } },
      product: { connect: { id: dto.productId } },
      value: dto.value,
      idempotencyKey: dto.idempotencyKey,
    });
  }

  async approve(proposalId: string, adminUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      const proposal = await tx.proposal.findUnique({
        where: { id: proposalId },
        include: { profile: { include: { user: true } }, product: true },
      });
      if (!proposal) throw new NotFoundException('Proposta nao encontrada');
      if (proposal.status !== 'pending') {
        throw new ConflictException('Proposta ja foi processada (idempotencia)');
      }
      const value = Number(proposal.value);
      const profileUserId = proposal.profile.userId;

      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: 'approved', approvedAt: new Date(), approvedById: adminUserId },
      });

      const uplines = await this.networkService.getUplines(profileUserId, 3);
      const level1 = uplines.find((u) => u.level === 1);
      const level2 = uplines.find((u) => u.level === 2);
      const level3 = uplines.find((u) => u.level === 3);
      const toCreate: Array<{ userId: string; level: number; percentage: number; amount: number }> = [];
      if (level1) toCreate.push({ userId: level1.referrerId, level: 1, percentage: 5, amount: value * 0.05 });
      if (level2) toCreate.push({ userId: level2.referrerId, level: 2, percentage: 3, amount: value * 0.03 });
      if (level3) toCreate.push({ userId: level3.referrerId, level: 3, percentage: 1, amount: value * 0.01 });
      toCreate.push({ userId: profileUserId, level: 1, percentage: 5, amount: value * 0.05 });

      for (const c of toCreate) {
        await tx.commission.create({
          data: {
            proposalId,
            userId: c.userId,
            level: c.level,
            percentage: c.percentage,
            amount: c.amount,
            status: 'pending',
          },
        });
      }

      const progress = await tx.affiliateProgress.upsert({
        where: { userId: profileUserId },
        create: { userId: profileUserId, totalSales: value },
        update: { totalSales: { increment: value } },
      });
      const newTotal = progress.totalSales;
      const levels = await tx.journeyLevel.findMany({ orderBy: { order: 'asc' } });
      let currentLevelId = progress.currentLevelId;
      let lastLevelUpAt = progress.lastLevelUpAt;
      for (const level of levels) {
        if (Number(level.minSales) <= newTotal) {
          if (level.id !== currentLevelId) {
            lastLevelUpAt = new Date();
            currentLevelId = level.id;
          }
        }
      }
      await tx.affiliateProgress.update({
        where: { userId: profileUserId },
        data: { currentLevelId, lastLevelUpAt },
      });

      await this.notificationsService.notifyProposalApproved(profileUserId, proposalId, value);
      const updated = await this.repository.findById(proposalId);
      return updated;
    });
  }

  async reject(proposalId: string, adminUserId: string, reason?: string) {
    const proposal = await this.repository.findById(proposalId);
    if (!proposal) throw new NotFoundException('Proposta nao encontrada');
    if (proposal.status !== 'pending') {
      throw new ConflictException('Proposta ja foi processada');
    }
    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: {
        status: 'rejected',
        rejectedAt: new Date(),
        rejectionReason: reason,
      },
    });
    const profileUserId = await this.getProfileUserIdByProposalId(proposalId);
    if (profileUserId) {
      await this.notificationsService.notifyProposalRejected(
        profileUserId,
        proposalId,
        reason,
      );
    }
    return this.repository.findById(proposalId);
  }

  async findById(id: string) {
    const p = await this.repository.findById(id);
    if (!p) throw new NotFoundException('Proposta nao encontrada');
    return p;
  }

  async findMany(page = 1, limit = 20, status?: ProposalStatus, profileId?: string) {
    const skip = (page - 1) * limit;
    const where: { status?: ProposalStatus; profileId?: string } = {};
    if (status) where.status = status;
    if (profileId) where.profileId = profileId;
    const [data, total] = await Promise.all([
      this.repository.findMany({ skip, take: limit, where }),
      this.repository.count(where),
    ]);
    return { data, total };
  }

  async getProfileUserIdByProposalId(proposalId: string): Promise<string | null> {
    const p = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { profile: { select: { userId: true } } },
    });
    return p?.profile?.userId ?? null;
  }

  async resolveProfileIdForUser(userId: string, profileIdQuery?: string): Promise<string | undefined> {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!profile) return undefined;
    if (profileIdQuery && profileIdQuery !== profile.id) return profile.id;
    return profile.id;
  }

  assertOwnership(profileUserId: string, currentUserId: string, isAdmin: boolean) {
    if (!isAdmin && profileUserId !== currentUserId) {
      throw new ForbiddenException('Acesso negado a esta proposta');
    }
  }
}
