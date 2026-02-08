import { PrismaService } from '../../prisma/prisma.service';
import { Commission, Prisma, CommissionStatus } from '@prisma/client';
export declare class CommissionsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.CommissionCreateInput): Promise<Commission>;
    createMany(data: Prisma.CommissionCreateManyInput[]): Promise<{
        count: number;
    }>;
    findById(id: string): Promise<Commission | null>;
    findManyByUserId(userId: string, status?: CommissionStatus, skip?: number, take?: number): Promise<{
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
    sumPendingByUserId(userId: string): Promise<number>;
    updateStatus(ids: string[], status: CommissionStatus, paidAt?: Date): Promise<number>;
    findPendingByUserId(userId: string): Promise<Commission[]>;
}
