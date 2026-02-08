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
exports.JourneyRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let JourneyRepository = class JourneyRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateProgress(userId) {
        let progress = await this.prisma.affiliateProgress.findUnique({
            where: { userId },
            include: { currentLevel: true },
        });
        if (!progress) {
            progress = await this.prisma.affiliateProgress.create({
                data: { userId },
                include: { currentLevel: true },
            });
        }
        return progress;
    }
    async getAllLevels() {
        return this.prisma.journeyLevel.findMany({
            orderBy: { order: 'asc' },
        });
    }
    async updateTotalSales(userId, additionalSales) {
        const progress = await this.getOrCreateProgress(userId);
        const newTotal = Number(progress.totalSales) + additionalSales;
        const levels = await this.getAllLevels();
        let currentLevelId = progress.currentLevelId;
        let lastLevelUpAt = progress.lastLevelUpAt;
        for (const level of levels) {
            if (Number(level.minSales) <= newTotal) {
                if (level.id !== currentLevelId) {
                    lastLevelUpAt = new Date();
                    currentLevelId = level.id;
                }
            }
        }
        return this.prisma.affiliateProgress.update({
            where: { userId },
            data: {
                totalSales: newTotal,
                currentLevelId,
                lastLevelUpAt,
            },
            include: { currentLevel: true },
        });
    }
    async getProgress(userId) {
        const progress = await this.getOrCreateProgress(userId);
        const levels = await this.getAllLevels();
        const currentOrder = progress.currentLevel?.order ?? 0;
        const nextLevel = levels.find((l) => l.order === currentOrder + 1);
        return {
            progress,
            levels,
            nextLevel,
            totalSales: Number(progress.totalSales),
        };
    }
};
exports.JourneyRepository = JourneyRepository;
exports.JourneyRepository = JourneyRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JourneyRepository);
//# sourceMappingURL=journey.repository.js.map