import { CommissionsService } from './commissions.service';
import type { JwtPayload } from '../../common/types/auth.types';
import { CommissionStatus } from '@prisma/client';
export declare class CommissionsController {
    private readonly commissionsService;
    constructor(commissionsService: CommissionsService);
    me(user: JwtPayload, status?: CommissionStatus, page?: string, limit?: string): Promise<{
        data: ({
            proposal: {
                product: {
                    id: string;
                    isActive: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    slug: string;
                    description: string | null;
                    price: number;
                };
            } & {
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
            };
        } & {
            id: string;
            createdAt: Date;
            userId: string;
            level: number;
            percentage: number;
            amount: number;
            status: import(".prisma/client").$Enums.CommissionStatus;
            paidAt: Date | null;
            proposalId: string;
        })[];
        meta: {
            total: number;
        };
    }>;
    balance(user: JwtPayload): Promise<{
        balance: number;
    }>;
    pending(user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        level: number;
        percentage: number;
        amount: number;
        status: import(".prisma/client").$Enums.CommissionStatus;
        paidAt: Date | null;
        proposalId: string;
    }[]>;
    findOne(id: string, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        level: number;
        percentage: number;
        amount: number;
        status: import(".prisma/client").$Enums.CommissionStatus;
        paidAt: Date | null;
        proposalId: string;
    }>;
}
