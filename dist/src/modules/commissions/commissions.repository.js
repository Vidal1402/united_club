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
exports.CommissionsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CommissionsRepository = class CommissionsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.commission.create({ data });
    }
    async createMany(data) {
        return this.prisma.commission.createMany({ data });
    }
    async findById(id) {
        return this.prisma.commission.findUnique({
            where: { id },
            include: { proposal: true, user: true },
        });
    }
    async findManyByUserId(userId, status, skip, take) {
        const where = { userId };
        if (status)
            where.status = status;
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
    async sumPendingByUserId(userId) {
        const result = await this.prisma.commission.aggregate({
            where: { userId, status: 'pending' },
            _sum: { amount: true },
        });
        return Number(result._sum.amount ?? 0);
    }
    async updateStatus(ids, status, paidAt) {
        const result = await this.prisma.commission.updateMany({
            where: { id: { in: ids } },
            data: { status, paidAt: paidAt ?? undefined },
        });
        return result.count;
    }
    async findPendingByUserId(userId) {
        return this.prisma.commission.findMany({
            where: { userId, status: 'pending' },
            orderBy: { createdAt: 'asc' },
            include: { proposal: true },
        });
    }
};
exports.CommissionsRepository = CommissionsRepository;
exports.CommissionsRepository = CommissionsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommissionsRepository);
//# sourceMappingURL=commissions.repository.js.map