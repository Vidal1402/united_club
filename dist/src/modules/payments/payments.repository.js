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
exports.PaymentsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let PaymentsRepository = class PaymentsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.payment.create({ data });
    }
    async findById(id) {
        return this.prisma.payment.findUnique({
            where: { id },
            include: { user: true, paymentCommissions: { include: { commission: true } } },
        });
    }
    async findManyByUserId(userId, status, skip, take) {
        const where = { userId };
        if (status)
            where.status = status;
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
    async createPaymentWithCommissions(userId, type, grossAmount, feeAmount, netAmount, commissionIds) {
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
    async markAsCompleted(paymentId, processedById, externalId) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { paymentCommissions: true },
        });
        if (!payment || payment.status !== 'pending')
            return null;
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
};
exports.PaymentsRepository = PaymentsRepository;
exports.PaymentsRepository = PaymentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsRepository);
//# sourceMappingURL=payments.repository.js.map