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
exports.NetworkRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let NetworkRepository = class NetworkRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.affiliateNetwork.create({ data });
    }
    async findUplines(affiliateId, maxLevel = 3) {
        const rows = await this.prisma.affiliateNetwork.findMany({
            where: { affiliateId },
            orderBy: { level: 'asc' },
            take: maxLevel,
            select: { referrerId: true, level: true },
        });
        return rows;
    }
    async findDownlines(referrerId, level) {
        const where = { referrerId };
        if (level != null)
            where.level = level;
        return this.prisma.affiliateNetwork.findMany({
            where,
            include: { affiliate: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async countDownlines(referrerId) {
        return this.prisma.affiliateNetwork.count({ where: { referrerId } });
    }
};
exports.NetworkRepository = NetworkRepository;
exports.NetworkRepository = NetworkRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NetworkRepository);
//# sourceMappingURL=network.repository.js.map