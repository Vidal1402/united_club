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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const commissions_service_1 = require("../commissions/commissions.service");
const journey_service_1 = require("../journey/journey.service");
const network_service_1 = require("../network/network.service");
let DashboardService = class DashboardService {
    prisma;
    commissionsService;
    journeyService;
    networkService;
    constructor(prisma, commissionsService, journeyService, networkService) {
        this.prisma = prisma;
        this.commissionsService = commissionsService;
        this.journeyService = journeyService;
        this.networkService = networkService;
    }
    async getMyDashboard(userId) {
        const [totalSales, balance, progress, networkStats, nextPayment] = await Promise.all([
            this.getTotalSales(userId),
            this.commissionsService.getPendingBalance(userId),
            this.journeyService.getMyProgress(userId),
            this.networkService.getNetworkStats(userId),
            this.getNextPayment(userId),
        ]);
        return {
            totalSales,
            totalCommissions: balance,
            nextPayment,
            journey: progress,
            network: networkStats,
        };
    }
    async getTotalSales(userId) {
        const progress = await this.prisma.affiliateProgress.findUnique({
            where: { userId },
        });
        return Number(progress?.totalSales ?? 0);
    }
    async getNextPayment(userId) {
        const pending = await this.prisma.payment.findFirst({
            where: { userId, status: 'pending' },
            orderBy: { createdAt: 'desc' },
        });
        if (!pending)
            return null;
        return {
            id: pending.id,
            amount: Number(pending.netAmount),
            type: pending.type,
            status: pending.status,
            createdAt: pending.createdAt,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        commissions_service_1.CommissionsService,
        journey_service_1.JourneyService,
        network_service_1.NetworkService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map