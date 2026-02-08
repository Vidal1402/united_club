import { PrismaService } from '../../prisma/prisma.service';
import { Payment, Prisma, PaymentStatus } from '@prisma/client';
export declare class PaymentsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.PaymentCreateInput): Promise<Payment>;
    findById(id: string): Promise<Payment | null>;
    findManyByUserId(userId: string, status?: PaymentStatus, skip?: number, take?: number): Promise<{
        data: ({
            paymentCommissions: ({
                commission: {
                    id: string;
                    createdAt: Date;
                    userId: string;
                    level: number;
                    percentage: number;
                    amount: number;
                    status: import(".prisma/client").$Enums.CommissionStatus;
                    paidAt: Date | null;
                    proposalId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                paymentId: string;
                commissionId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            type: import(".prisma/client").$Enums.PaymentType;
            grossAmount: number;
            feeAmount: number;
            netAmount: number;
            processedAt: Date | null;
            processedById: string | null;
            externalId: string | null;
        })[];
        total: number;
    }>;
    createPaymentWithCommissions(userId: string, type: 'withdrawal' | 'advance', grossAmount: number, feeAmount: number, netAmount: number, commissionIds: string[]): Promise<Payment>;
    markAsCompleted(paymentId: string, processedById: string, externalId?: string): Promise<Payment | null>;
}
