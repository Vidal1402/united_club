import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CommissionsService } from '../commissions/commissions.service';
import { JourneyService } from '../journey/journey.service';
import { NetworkService } from '../network/network.service';

@Injectable()
export class DashboardService {
  constructor(
    private prisma: PrismaService,
    private commissionsService: CommissionsService,
    private journeyService: JourneyService,
    private networkService: NetworkService,
  ) {}

  async getMyDashboard(userId: string) {
    const [totalSales, balance, progress, networkStats, nextPayment, networkSales] =
      await Promise.all([
        this.getTotalSales(userId),
        this.commissionsService.getPendingBalance(userId),
        this.journeyService.getMyProgress(userId),
        this.networkService.getNetworkStats(userId),
        this.getNextPayment(userId),
        this.getNetworkSales(userId),
      ]);
    return {
      totalSales,
      totalCommissions: balance,
      networkSales,
      nextPayment,
      journey: progress,
      network: networkStats,
    };
  }

  private async getTotalSales(userId: string): Promise<number> {
    const progress = await this.prisma.affiliateProgress.findUnique({
      where: { userId },
    });
    return Number(progress?.totalSales ?? 0);
  }

  /** Soma das vendas aprovadas feitas pelos downlines (rede). Para o afiliado pai ver "vendas da equipe". */
  private async getNetworkSales(userId: string): Promise<number> {
    const downlineIds = await this.networkService.getDownlineUserIds(userId);
    if (downlineIds.length === 0) return 0;
    const result = await this.prisma.proposal.aggregate({
      where: {
        status: 'approved',
        profile: { userId: { in: downlineIds } },
      },
      _sum: { value: true },
    });
    return Number(result._sum?.value ?? 0);
  }

  private async getNextPayment(userId: string) {
    const pending = await this.prisma.payment.findFirst({
      where: { userId, status: 'pending' },
      orderBy: { createdAt: 'desc' },
    });
    if (!pending) return null;
    return {
      id: pending.id,
      amount: Number(pending.netAmount),
      type: pending.type,
      status: pending.status,
      createdAt: pending.createdAt,
    };
  }
}
