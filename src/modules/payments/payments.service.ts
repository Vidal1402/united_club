import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { CommissionsService } from '../commissions/commissions.service';
import { NotificationsService } from '../notifications/notifications.service';
import type { Commission } from '@prisma/client';

@Injectable()
export class PaymentsService {
  constructor(
    private repository: PaymentsRepository,
    private commissionsService: CommissionsService,
    private notificationsService: NotificationsService,
  ) {}

  async requestWithdrawal(userId: string, amount: number) {
    const pending = await this.commissionsService.getPendingCommissions(userId);
    const totalPending = pending.reduce((s: number, c: Commission) => s + Number(c.amount), 0);
    if (amount > totalPending || amount <= 0) {
      throw new BadRequestException('Valor invalido ou acima do saldo disponivel');
    }
    let totalReserved = 0;
    const commissionIds: string[] = [];
    for (const c of pending) {
      if (totalReserved >= amount) break;
      totalReserved += Number(c.amount);
      commissionIds.push(c.id);
    }
    if (totalReserved < amount) commissionIds.pop();
    return this.repository.createPaymentWithCommissions(
      userId,
      'withdrawal',
      totalReserved,
      0,
      totalReserved,
      commissionIds,
    );
  }

  async requestAdvance(userId: string, amount: number) {
    const fee = amount * 0.05;
    const netAmount = amount - fee;
    const pending = await this.commissionsService.getPendingCommissions(userId);
    const totalPending = pending.reduce((s: number, c: Commission) => s + Number(c.amount), 0);
    if (amount > totalPending || amount <= 0) {
      throw new BadRequestException('Valor invalido ou acima do saldo disponivel');
    }
    let totalReserved = 0;
    const commissionIds: string[] = [];
    for (const c of pending) {
      if (totalReserved >= amount) break;
      totalReserved += Number(c.amount);
      commissionIds.push(c.id);
    }
    if (totalReserved < amount) commissionIds.pop();
    return this.repository.createPaymentWithCommissions(
      userId,
      'advance',
      amount,
      fee,
      netAmount,
      commissionIds,
    );
  }

  async markAsPaid(paymentId: string, adminUserId: string, externalId?: string) {
    const payment = await this.repository.findById(paymentId);
    if (!payment) throw new NotFoundException('Pagamento nao encontrado');
    if (payment.status !== 'pending') {
      throw new BadRequestException('Pagamento ja foi processado');
    }
    const updated = await this.repository.markAsCompleted(
      paymentId,
      adminUserId,
      externalId,
    );
    if (updated) {
      await this.notificationsService.notifyPaymentProcessed(
        payment.userId,
        Number(payment.netAmount),
      );
    }
    return updated;
  }

  async findMyPayments(userId: string, status?: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const st = status as 'pending' | 'completed' | undefined;
    return this.repository.findManyByUserId(userId, st, skip, limit);
  }

  async findById(id: string) {
    const p = await this.repository.findById(id);
    if (!p) throw new NotFoundException('Pagamento nao encontrado');
    return p;
  }

  assertOwnership(paymentUserId: string, currentUserId: string) {
    if (paymentUserId !== currentUserId) {
      throw new ForbiddenException('Acesso negado a este pagamento');
    }
  }
}
