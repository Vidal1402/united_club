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
exports.CommissionsService = void 0;
const common_1 = require("@nestjs/common");
const commissions_repository_1 = require("./commissions.repository");
const constants_1 = require("../../common/constants");
let CommissionsService = class CommissionsService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async createForProposal(proposalId, profileUserId, uplines, saleValue) {
        const commissions = [];
        const level1 = constants_1.COMMISSION_LEVELS.find((c) => c.level === 1);
        const level2 = constants_1.COMMISSION_LEVELS.find((c) => c.level === 2);
        const level3 = constants_1.COMMISSION_LEVELS.find((c) => c.level === 3);
        for (const u of uplines) {
            const config = u.level === 1 ? level1 : u.level === 2 ? level2 : level3;
            if (!config)
                continue;
            const amount = (saleValue * config.percentage) / 100;
            commissions.push({
                proposalId,
                userId: u.referrerId,
                level: config.level,
                percentage: config.percentage,
                amount,
            });
        }
        const direct = constants_1.COMMISSION_LEVELS.find((c) => c.level === 1);
        if (direct) {
            const amount = (saleValue * direct.percentage) / 100;
            commissions.push({
                proposalId,
                userId: profileUserId,
                level: 1,
                percentage: direct.percentage,
                amount,
            });
        }
        await this.repository.createMany(commissions.map((c) => ({
            proposalId: c.proposalId,
            userId: c.userId,
            level: c.level,
            percentage: c.percentage,
            amount: c.amount,
            status: 'pending',
        })));
        return commissions;
    }
    async findMyCommissions(userId, status, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        return this.repository.findManyByUserId(userId, status, skip, limit);
    }
    async getPendingBalance(userId) {
        return this.repository.sumPendingByUserId(userId);
    }
    async getPendingCommissions(userId) {
        return this.repository.findPendingByUserId(userId);
    }
    async markAsPaid(commissionIds, paidAt) {
        return this.repository.updateStatus(commissionIds, 'paid', paidAt);
    }
    async markAsReserved(commissionIds) {
        return this.repository.updateStatus(commissionIds, 'reserved');
    }
    async findById(id) {
        const c = await this.repository.findById(id);
        if (!c)
            throw new common_1.NotFoundException('Comissao nao encontrada');
        return c;
    }
    assertOwnership(commissionUserId, currentUserId) {
        if (commissionUserId !== currentUserId) {
            throw new common_1.ForbiddenException('Acesso negado a esta comissao');
        }
    }
};
exports.CommissionsService = CommissionsService;
exports.CommissionsService = CommissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [commissions_repository_1.CommissionsRepository])
], CommissionsService);
//# sourceMappingURL=commissions.service.js.map