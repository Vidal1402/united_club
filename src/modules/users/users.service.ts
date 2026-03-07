import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { DashboardService } from '../dashboard/dashboard.service';
import { CommissionsService } from '../commissions/commissions.service';
import { ProposalsService } from '../proposals/proposals.service';
import { ProfilesService } from '../profiles/profiles.service';
import { User, Profile, Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private repository: UsersRepository,
    private dashboardService: DashboardService,
    private commissionsService: CommissionsService,
    private proposalsService: ProposalsService,
    private profilesService: ProfilesService,
  ) {}

  async create(data: {
    email: string;
    passwordHash: string;
    role?: Role;
  }): Promise<User> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }
    return this.repository.create({
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: data.role ?? 'affiliate',
    });
  }

  async createForRegister(data: {
    email: string;
    passwordHash: string;
    fullName: string;
    phone?: string;
  }): Promise<User & { profile: Profile | null }> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('E-mail já cadastrado');
    }
    return this.repository.createUserWithProfile(
      {
        email: data.email,
        passwordHash: data.passwordHash,
        role: 'affiliate',
        isActive: false,
      },
      { fullName: data.fullName, phone: data.phone },
    );
  }

  async setActive(id: string, isActive: boolean): Promise<User> {
    return this.repository.update(id, { isActive });
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  async findMany(params: {
    page?: number;
    limit?: number;
    role?: Role;
    isActive?: boolean;
  }) {
    const skip = params.page && params.limit ? (params.page - 1) * params.limit : 0;
    const take = params.limit ?? 20;
    const where: { role?: Role; isActive?: boolean } = {};
    if (params.role) where.role = params.role;
    if (params.isActive !== undefined) where.isActive = params.isActive;
    const [users, total] = await Promise.all([
      this.repository.findMany({ skip, take, where }),
      this.repository.count(where),
    ]);
    return { data: users, total };
  }

  /**
   * Detalhes completos do usuário para a área admin: vendas, comissões, propostas (contagens e histórico), rede, jornada.
   */
  async getUserDetails(userId: string) {
    const user = await this.repository.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    const { passwordHash: _, ...userSafe } = user;

    const profile = await this.profilesService.findOptionalByUserId(userId);
    const profileId = profile?.id;

    const [dashboard, proposalsSummary, proposalsCountByStatus, commissionsList, commissionsBalance] =
      await Promise.all([
        this.dashboardService.getMyDashboard(userId),
        profileId
          ? this.proposalsService.findMany(1, 10, undefined, profileId)
          : Promise.resolve({ data: [], total: 0 }),
        profileId
          ? this.proposalsService.getCountByStatusForProfile(profileId)
          : Promise.resolve({ pending: 0, approved: 0, rejected: 0 }),
        this.commissionsService.findMyCommissions(userId, undefined, 1, 15),
        this.commissionsService.getPendingBalance(userId),
      ]);

    return {
      user: userSafe,
      profile: profile ?? null,
      dashboard: {
        totalSales: dashboard.totalSales,
        totalCommissions: dashboard.totalCommissions,
        networkSales: dashboard.networkSales,
        journey: dashboard.journey,
        network: dashboard.network,
        nextPayment: dashboard.nextPayment,
      },
      proposalsSummary: {
        total: proposalsSummary.total,
        pending: proposalsCountByStatus.pending,
        approved: proposalsCountByStatus.approved,
        rejected: proposalsCountByStatus.rejected,
        recent: proposalsSummary.data,
      },
      commissions: {
        balance: commissionsBalance,
        recent: commissionsList.data,
        totalCommissions: commissionsList.total,
      },
    };
  }
}
