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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const payments_repository_1 = require("./payments.repository");
const commissions_service_1 = require("../commissions/commissions.service");
const notifications_service_1 = require("../notifications/notifications.service");
let PaymentsService = class PaymentsService {
    repository;
    commissionsService;
    notificationsService;
    constructor(repository, commissionsService, notificationsService) {
        this.repository = repository;
        this.commissionsService = commissionsService;
        this.notificationsService = notificationsService;
    }
    async requestWithdrawal(userId, amount) {
        const pending = await this.commissionsService.getPendingCommissions(userId);
        const totalPending = pending.reduce((s, c) => s + Number(c.amount), 0);
        if (amount > totalPending || amount <= 0) {
            throw new common_1.BadRequestException('Valor invalido ou acima do saldo disponivel');
        }
        let totalReserved = 0;
        const commissionIds = [];
        for (const c of pending) {
            if (totalReserved >= amount)
                break;
            totalReserved += Number(c.amount);
            commissionIds.push(c.id);
        }
        if (totalReserved < amount)
            commissionIds.pop();
        return this.repository.createPaymentWithCommissions(userId, 'withdrawal', totalReserved, 0, totalReserved, commissionIds);
    }
    async requestAdvance(userId, amount) {
        const fee = amount * 0.05;
        const netAmount = amount - fee;
        const pending = await this.commissionsService.getPendingCommissions(userId);
        const totalPending = pending.reduce((s, c) => s + Number(c.amount), 0);
        if (amount > totalPending || amount <= 0) {
            throw new common_1.BadRequestException('Valor invalido ou acima do saldo disponivel');
        }
        let totalReserved = 0;
        const commissionIds = [];
        for (const c of pending) {
            if (totalReserved >= amount)
                break;
            totalReserved += Number(c.amount);
            commissionIds.push(c.id);
        }
        if (totalReserved < amount)
            commissionIds.pop();
        return this.repository.createPaymentWithCommissions(userId, 'advance', amount, fee, netAmount, commissionIds);
    }
    async markAsPaid(paymentId, adminUserId, externalId) {
        const payment = await this.repository.findById(paymentId);
        if (!payment)
            throw new common_1.NotFoundException('Pagamento nao encontrado');
        if (payment.status !== 'pending') {
            throw new common_1.BadRequestException('Pagamento ja foi processado');
        }
        const updated = await this.repository.markAsCompleted(paymentId, adminUserId, externalId);
        if (updated) {
            await this.notificationsService.notifyPaymentProcessed(payment.userId, Number(payment.netAmount));
        }
        return updated;
    }
    async findMyPayments(userId, status, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const st = status;
        return this.repository.findManyByUserId(userId, st, skip, limit);
    }
    async findById(id) {
        const p = await this.repository.findById(id);
        if (!p)
            throw new common_1.NotFoundException('Pagamento nao encontrado');
        return p;
    }
    assertOwnership(paymentUserId, currentUserId) {
        if (paymentUserId !== currentUserId) {
            throw new common_1.ForbiddenException('Acesso negado a este pagamento');
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_repository_1.PaymentsRepository,
        commissions_service_1.CommissionsService,
        notifications_service_1.NotificationsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map