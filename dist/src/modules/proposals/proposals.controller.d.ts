import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ApproveProposalDto } from './dto/approve-proposal.dto';
import type { JwtPayload } from '../../common/types/auth.types';
import { ProposalStatus } from '@prisma/client';
export declare class ProposalsController {
    private readonly proposalsService;
    constructor(proposalsService: ProposalsService);
    create(dto: CreateProposalDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProposalStatus;
        idempotencyKey: string | null;
        value: number;
        approvedAt: Date | null;
        approvedById: string | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        profileId: string;
        productId: string;
    }>;
    list(page?: string, limit?: string, status?: ProposalStatus, profileId?: string, user?: JwtPayload): Promise<{
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.ProposalStatus;
            idempotencyKey: string | null;
            value: number;
            approvedAt: Date | null;
            approvedById: string | null;
            rejectedAt: Date | null;
            rejectionReason: string | null;
            profileId: string;
            productId: string;
        }[];
        meta: {
            total: number;
        };
    }>;
    findOne(id: string, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProposalStatus;
        idempotencyKey: string | null;
        value: number;
        approvedAt: Date | null;
        approvedById: string | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        profileId: string;
        productId: string;
    }>;
    approve(id: string, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProposalStatus;
        idempotencyKey: string | null;
        value: number;
        approvedAt: Date | null;
        approvedById: string | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        profileId: string;
        productId: string;
    } | null>;
    reject(id: string, dto: ApproveProposalDto, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.ProposalStatus;
        idempotencyKey: string | null;
        value: number;
        approvedAt: Date | null;
        approvedById: string | null;
        rejectedAt: Date | null;
        rejectionReason: string | null;
        profileId: string;
        productId: string;
    } | null>;
}
