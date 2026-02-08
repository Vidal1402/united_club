import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Payment, Prisma, PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return this.prisma.payment.create({ data });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { user: true, paymentCommissions: { include: { commission: true } } },
    });
  }

  async findManyByUserId(
    userId: string,
    status?: PaymentStatus,
    skip?: number,
    take?: number,
  ) {
    const where: Prisma.PaymentWhereInput = { userId };
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { paymentCommissions: { include: { commission: true } } },
      }),
      this.prisma.payment.count({ where }),
    ]);
    return { data, total };
  }

  async createPaymentWithCommissions(
    userId: string,
    type: 'withdrawal' | 'advance',
    grossAmount: number,
    feeAmount: number,
    netAmount: number,
    commissionIds: string[],
  ): Promise<Payment> {
    return this.prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          userId,
          type,
          grossAmount,
          feeAmount,
          netAmount,
          status: 'pending',
        },
      });
      for (const cid of commissionIds) {
        await tx.paymentCommission.create({
          data: { paymentId: payment.id, commissionId: cid },
        });
      }
      await tx.commission.updateMany({
        where: { id: { in: commissionIds } },
        data: { status: 'reserved' },
      });
      return payment;
    });
  }

  async markAsCompleted(
    paymentId: string,
    processedById: string,
    externalId?: string,
  ): Promise<Payment | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { paymentCommissions: true },
    });
    if (!payment || payment.status !== 'pending') return null;
    const commissionIds = payment.paymentCommissions.map((pc) => pc.commissionId);
    await this.prisma.$transaction([
      this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: 'completed',
          processedAt: new Date(),
          processedById,
          externalId,
        },
      }),
      this.prisma.commission.updateMany({
        where: { id: { in: commissionIds } },
        data: { status: 'paid', paidAt: new Date() },
      }),
    ]);
    return this.findById(paymentId);
  }
}
