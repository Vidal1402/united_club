import { CommissionsRepository } from './commissions.repository';
import { CommissionStatus } from '@prisma/client';
export declare class CommissionsService {
    private repository;
    constructor(repository: CommissionsRepository);
    createForProposal(proposalId: string, profileUserId: string, uplines: Array<{
        referrerId: string;
        level: number;
    }>, saleValue: number): Promise<{
        proposalId: string;
        userId: string;
        level: number;
        percentage: number;
        amount: number;
    }[]>;
    findMyCommissions(userId: string, status?: CommissionStatus, page?: number, limit?: number): Promise<{
        data: ({
            proposal: {
                product: {
                    id: string;
                    slug: string;
                    name: string;
                    createdAt: Date;
                    isActive: boolean;
                    updatedAt: Date;
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
        total: number;
    }>;
    getPendingBalance(userId: string): Promise<number>;
    getPendingCommissions(userId: string): Promise<{
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
    markAsPaid(commissionIds: string[], paidAt: Date): Promise<number>;
    markAsReserved(commissionIds: string[]): Promise<number>;
    findById(id: string): Promise<{
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
    assertOwnership(commissionUserId: string, currentUserId: string): void;
}
