import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from './notifications.repository';
import { NotificationType } from '@prisma/client';

@Injectable()
export class NotificationsService {
  constructor(private repository: NotificationsRepository) {}

  async notify(params: {
    userId: string;
    type: NotificationType;
    title: string;
    body?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.repository.create(params);
  }

  async notifyProposalApproved(userId: string, proposalId: string, value: number) {
    return this.notify({
      userId,
      type: 'proposal_approved',
      title: 'Proposta aprovada',
      body: `Sua proposta de venda no valor de R$ ${value.toFixed(2)} foi aprovada.`,
      metadata: { proposalId },
    });
  }

  async notifyProposalRejected(userId: string, proposalId: string, reason?: string) {
    return this.notify({
      userId,
      type: 'proposal_rejected',
      title: 'Proposta rejeitada',
      body: reason ?? 'Sua proposta foi rejeitada.',
      metadata: { proposalId },
    });
  }

  async notifyCommissionAvailable(userId: string, amount: number) {
    return this.notify({
      userId,
      type: 'commission_available',
      title: 'Comissao disponivel',
      body: `Voce tem R$ ${amount.toFixed(2)} disponiveis para saque.`,
    });
  }

  async notifyPaymentProcessed(userId: string, amount: number) {
    return this.notify({
      userId,
      type: 'payment_processed',
      title: 'Pagamento processado',
      body: `Seu pagamento de R$ ${amount.toFixed(2)} foi processado.`,
    });
  }

  async notifyLevelUnlocked(userId: string, levelName: string) {
    return this.notify({
      userId,
      type: 'level_unlocked',
      title: 'Novo nivel desbloqueado',
      body: `Parabens! Voce alcancou o nivel ${levelName}.`,
      metadata: { levelName },
    });
  }

  async notifyNewNetworkConnection(referrerId: string, affiliateName: string) {
    return this.notify({
      userId: referrerId,
      type: 'new_network_connection',
      title: 'Nova conexao na rede',
      body: `${affiliateName} entrou na sua rede.`,
    });
  }

  async findMyNotifications(userId: string, unreadOnly?: boolean, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.repository.findManyByUserId(userId, unreadOnly, skip, limit);
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.repository.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId: string) {
    return this.repository.markAllAsRead(userId);
  }
}
