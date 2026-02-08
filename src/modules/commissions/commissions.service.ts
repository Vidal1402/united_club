import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CommissionsRepository } from './commissions.repository';
import { CommissionStatus } from '@prisma/client';
import { COMMISSION_LEVELS } from '../../common/constants';

@Injectable()
export class CommissionsService {
  constructor(private repository: CommissionsRepository) {}

  async createForProposal(
    proposalId: string,
    profileUserId: string,
    uplines: Array<{ referrerId: string; level: number }>,
    saleValue: number,
  ) {
    const commissions: Array<{
      proposalId: string;
      userId: string;
      level: number;
      percentage: number;
      amount: number;
    }> = [];
    const level1 = COMMISSION_LEVELS.find((c) => c.level === 1);
    const level2 = COMMISSION_LEVELS.find((c) => c.level === 2);
    const level3 = COMMISSION_LEVELS.find((c) => c.level === 3);
    for (const u of uplines) {
      const config = u.level === 1 ? level1 : u.level === 2 ? level2 : level3;
      if (!config) continue;
      const amount = (saleValue * config.percentage) / 100;
      commissions.push({
        proposalId,
        userId: u.referrerId,
        level: config.level,
        percentage: config.percentage,
        amount,
      });
    }
    const direct = COMMISSION_LEVELS.find((c) => c.level === 1);
    if (direct) {
      const amount = (saleValue * direct.percentage) / 100;
      commissions.push({
        proposalId,
        userId: profileUserId,
        level: 1,
        percentage: direct.percentage,
        amount,
      });
    }
    await this.repository.createMany(
      commissions.map((c) => ({
        proposalId: c.proposalId,
        userId: c.userId,
        level: c.level,
        percentage: c.percentage,
        amount: c.amount,
        status: 'pending' as CommissionStatus,
      })),
    );
    return commissions;
  }

  async findMyCommissions(userId: string, status?: CommissionStatus, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.repository.findManyByUserId(userId, status, skip, limit);
  }

  async getPendingBalance(userId: string): Promise<number> {
    return this.repository.sumPendingByUserId(userId);
  }

  async getPendingCommissions(userId: string) {
    return this.repository.findPendingByUserId(userId);
  }

  async markAsPaid(commissionIds: string[], paidAt: Date) {
    return this.repository.updateStatus(commissionIds, 'paid', paidAt);
  }

  async markAsReserved(commissionIds: string[]) {
    return this.repository.updateStatus(commissionIds, 'reserved');
  }

  async findById(id: string) {
    const c = await this.repository.findById(id);
    if (!c) throw new NotFoundException('Comissao nao encontrada');
    return c;
  }

  assertOwnership(commissionUserId: string, currentUserId: string) {
    if (commissionUserId !== currentUserId) {
      throw new ForbiddenException('Acesso negado a esta comissao');
    }
  }
}
