"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const notifications_repository_1 = require("./notifications.repository");
let NotificationsService = class NotificationsService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async notify(params) {
        return this.repository.create(params);
    }
    async notifyProposalApproved(userId, proposalId, value) {
        return this.notify({
            userId,
            type: 'proposal_approved',
            title: 'Proposta aprovada',
            body: `Sua proposta de venda no valor de R$ ${value.toFixed(2)} foi aprovada.`,
            metadata: { proposalId },
        });
    }
    async notifyProposalRejected(userId, proposalId, reason) {
        return this.notify({
            userId,
            type: 'proposal_rejected',
            title: 'Proposta rejeitada',
            body: reason ?? 'Sua proposta foi rejeitada.',
            metadata: { proposalId },
        });
    }
    async notifyCommissionAvailable(userId, amount) {
        return this.notify({
            userId,
            type: 'commission_available',
            title: 'Comissao disponivel',
            body: `Voce tem R$ ${amount.toFixed(2)} disponiveis para saque.`,
        });
    }
    async notifyPaymentProcessed(userId, amount) {
        return this.notify({
            userId,
            type: 'payment_processed',
            title: 'Pagamento processado',
            body: `Seu pagamento de R$ ${amount.toFixed(2)} foi processado.`,
        });
    }
    async notifyLevelUnlocked(userId, levelName) {
        return this.notify({
            userId,
            type: 'level_unlocked',
            title: 'Novo nivel desbloqueado',
            body: `Parabens! Voce alcancou o nivel ${levelName}.`,
            metadata: { levelName },
        });
    }
    async notifyNewNetworkConnection(referrerId, affiliateName) {
        return this.notify({
            userId: referrerId,
            type: 'new_network_connection',
            title: 'Nova conexao na rede',
            body: `${affiliateName} entrou na sua rede.`,
        });
    }
    async findMyNotifications(userId, unreadOnly, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.repository.findManyByUserId(userId, unreadOnly, skip, limit);
    }
    async markAsRead(notificationId, userId) {
        return this.repository.markAsRead(notificationId, userId);
    }
    async markAllAsRead(userId) {
        return this.repository.markAllAsRead(userId);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_repository_1.NotificationsRepository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map