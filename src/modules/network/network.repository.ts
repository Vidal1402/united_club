import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AffiliateNetwork, Prisma } from '@prisma/client';

@Injectable()
export class NetworkRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.AffiliateNetworkCreateInput): Promise<AffiliateNetwork> {
    return this.prisma.affiliateNetwork.create({ data });
  }

  async findUplines(affiliateId: string, maxLevel: number = 3): Promise<{ referrerId: string; level: number }[]> {
    const rows = await this.prisma.affiliateNetwork.findMany({
      where: { affiliateId },
      orderBy: { level: 'asc' },
      take: maxLevel,
      select: { referrerId: true, level: true },
    });
    return rows;
  }

  async findDownlines(referrerId: string, level?: number): Promise<AffiliateNetwork[]> {
    const where: Prisma.AffiliateNetworkWhereInput = { referrerId };
    if (level != null) where.level = level;
    return this.prisma.affiliateNetwork.findMany({
      where,
      include: { affiliate: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async countDownlines(referrerId: string): Promise<number> {
    return this.prisma.affiliateNetwork.count({ where: { referrerId } });
  }
}
