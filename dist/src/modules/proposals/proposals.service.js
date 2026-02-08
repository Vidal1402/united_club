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
exports.ProposalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const proposals_repository_1 = require("./proposals.repository");
const network_service_1 = require("../network/network.service");
const commissions_service_1 = require("../commissions/commissions.service");
const journey_service_1 = require("../journey/journey.service");
const notifications_service_1 = require("../notifications/notifications.service");
let ProposalsService = class ProposalsService {
    prisma;
    repository;
    networkService;
    commissionsService;
    journeyService;
    notificationsService;
    constructor(prisma, repository, networkService, commissionsService, journeyService, notificationsService) {
        this.prisma = prisma;
        this.repository = repository;
        this.networkService = networkService;
        this.commissionsService = commissionsService;
        this.journeyService = journeyService;
        this.notificationsService = notificationsService;
    }
    async create(dto) {
        if (dto.idempotencyKey) {
            const existing = await this.repository.findByIdempotencyKey(dto.idempotencyKey);
            if (existing)
                return existing;
        }
        const profile = await this.prisma.profile.findUnique({
            where: { id: dto.profileId },
            include: { user: true },
        });
        if (!profile)
            throw new common_1.NotFoundException('Perfil nao encontrado');
        const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
        if (!product)
            throw new common_1.NotFoundException('Produto nao encontrado');
        return this.repository.create({
            profile: { connect: { id: dto.profileId } },
            product: { connect: { id: dto.productId } },
            value: dto.value,
            idempotencyKey: dto.idempotencyKey,
        });
    }
    async approve(proposalId, adminUserId) {
        return this.prisma.$transaction(async (tx) => {
            const proposal = await tx.proposal.findUnique({
                where: { id: proposalId },
                include: { profile: { include: { user: true } }, product: true },
            });
            if (!proposal)
                throw new common_1.NotFoundException('Proposta nao encontrada');
            if (proposal.status !== 'pending') {
                throw new common_1.ConflictException('Proposta ja foi processada (idempotencia)');
            }
            const value = Number(proposal.value);
            const profileUserId = proposal.profile.userId;
            await tx.proposal.update({
                where: { id: proposalId },
                data: { status: 'approved', approvedAt: new Date(), approvedById: adminUserId },
            });
            const uplines = await this.networkService.getUplines(profileUserId, 3);
            const level1 = uplines.find((u) => u.level === 1);
            const level2 = uplines.find((u) => u.level === 2);
            const level3 = uplines.find((u) => u.level === 3);
            const toCreate = [];
            if (level1)
                toCreate.push({ userId: level1.referrerId, level: 1, percentage: 5, amount: value * 0.05 });
            if (level2)
                toCreate.push({ userId: level2.referrerId, level: 2, percentage: 3, amount: value * 0.03 });
            if (level3)
                toCreate.push({ userId: level3.referrerId, level: 3, percentage: 1, amount: value * 0.01 });
            toCreate.push({ userId: profileUserId, level: 1, percentage: 5, amount: value * 0.05 });
            for (const c of toCreate) {
                await tx.commission.create({
                    data: {
                        proposalId,
                        userId: c.userId,
                        level: c.level,
                        percentage: c.percentage,
                        amount: c.amount,
                        status: 'pending',
                    },
                });
            }
            const progress = await tx.affiliateProgress.upsert({
                where: { userId: profileUserId },
                create: { userId: profileUserId, totalSales: value },
                update: { totalSales: { increment: value } },
            });
            const newTotal = progress.totalSales;
            const levels = await tx.journeyLevel.findMany({ orderBy: { order: 'asc' } });
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
            await tx.affiliateProgress.update({
                where: { userId: profileUserId },
                data: { currentLevelId, lastLevelUpAt },
            });
            await this.notificationsService.notifyProposalApproved(profileUserId, proposalId, value);
            const updated = await this.repository.findById(proposalId);
            return updated;
        });
    }
    async reject(proposalId, adminUserId, reason) {
        const proposal = await this.repository.findById(proposalId);
        if (!proposal)
            throw new common_1.NotFoundException('Proposta nao encontrada');
        if (proposal.status !== 'pending') {
            throw new common_1.ConflictException('Proposta ja foi processada');
        }
        await this.prisma.proposal.update({
            where: { id: proposalId },
            data: {
                status: 'rejected',
                rejectedAt: new Date(),
                rejectionReason: reason,
            },
        });
        const profileUserId = await this.getProfileUserIdByProposalId(proposalId);
        if (profileUserId) {
            await this.notificationsService.notifyProposalRejected(profileUserId, proposalId, reason);
        }
        return this.repository.findById(proposalId);
    }
    async findById(id) {
        const p = await this.repository.findById(id);
        if (!p)
            throw new common_1.NotFoundException('Proposta nao encontrada');
        return p;
    }
    async findMany(page = 1, limit = 20, status, profileId) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status)
            where.status = status;
        if (profileId)
            where.profileId = profileId;
        const [data, total] = await Promise.all([
            this.repository.findMany({ skip, take: limit, where }),
            this.repository.count(where),
        ]);
        return { data, total };
    }
    async getProfileUserIdByProposalId(proposalId) {
        const p = await this.prisma.proposal.findUnique({
            where: { id: proposalId },
            select: { profile: { select: { userId: true } } },
        });
        return p?.profile?.userId ?? null;
    }
    async resolveProfileIdForUser(userId, profileIdQuery) {
        const profile = await this.prisma.profile.findUnique({
            where: { userId },
            select: { id: true },
        });
        if (!profile)
            return undefined;
        if (profileIdQuery && profileIdQuery !== profile.id)
            return profile.id;
        return profile.id;
    }
    assertOwnership(profileUserId, currentUserId, isAdmin) {
        if (!isAdmin && profileUserId !== currentUserId) {
            throw new common_1.ForbiddenException('Acesso negado a esta proposta');
        }
    }
};
exports.ProposalsService = ProposalsService;
exports.ProposalsService = ProposalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        proposals_repository_1.ProposalsRepository,
        network_service_1.NetworkService,
        commissions_service_1.CommissionsService,
        journey_service_1.JourneyService,
        notifications_service_1.NotificationsService])
], ProposalsService);
//# sourceMappingURL=proposals.service.js.map