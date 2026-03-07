import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Commission, Prisma, CommissionStatus } from '@prisma/client';

@Injectable()
export class CommissionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CommissionCreateInput): Promise<Commission> {
    return this.prisma.commission.create({ data });
  }

  async createMany(data: Prisma.CommissionCreateManyInput[]): Promise<{ count: number }> {
    return this.prisma.commission.createMany({ data });
  }

  async findById(id: string): Promise<Commission | null> {
    return this.prisma.commission.findUnique({
      where: { id },
      include: { proposal: true, user: true },
    });
  }

  async findManyByUserId(userId: string, status?: CommissionStatus, skip?: number, take?: number) {
    const where: Prisma.CommissionWhereInput = { userId };
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.commission.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { proposal: { include: { product: true } } },
      }),
      this.prisma.commission.count({ where }),
    ]);
    return { data, total };
  }

  async sumPendingByUserId(userId: string): Promise<number> {
    const result = await this.prisma.commission.aggregate({
      where: { userId, status: 'pending' },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  async updateStatus(ids: string[], status: CommissionStatus, paidAt?: Date): Promise<number> {
    const result = await this.prisma.commission.updateMany({
      where: { id: { in: ids } },
      data: { status, paidAt: paidAt ?? undefined },
    });
    return result.count;
  }

  async findPendingByUserId(userId: string): Promise<Commission[]> {
    return this.prisma.commission.findMany({
      where: { userId, status: 'pending' },
      orderBy: { createdAt: 'asc' },
      include: { proposal: true },
    });
  }

  /** Saldo pendente por usuário (para admin ver quem tem comissão disponível para saque). */
  async getPendingBalanceByUser(): Promise<{ userId: string; balance: number }[]> {
    const rows = await this.prisma.commission.findMany({
      where: { status: 'pending' },
      select: { userId: true, amount: true },
    });
    const byUser = new Map<string, number>();
    for (const r of rows) {
      const cur = byUser.get(r.userId) ?? 0;
      byUser.set(r.userId, cur + Number(r.amount));
    }
    return Array.from(byUser.entries()).map(([userId, balance]) => ({ userId, balance })).filter((g) => g.balance > 0);
  }
}
