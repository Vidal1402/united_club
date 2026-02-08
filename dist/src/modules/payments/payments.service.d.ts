import { PaymentsRepository } from './payments.repository';
import { CommissionsService } from '../commissions/commissions.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class PaymentsService {
    private repository;
    private commissionsService;
    private notificationsService;
    constructor(repository: PaymentsRepository, commissionsService: CommissionsService, notificationsService: NotificationsService);
    requestWithdrawal(userId: string, amount: number): Promise<{
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
    }>;
    requestAdvance(userId: string, amount: number): Promise<{
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
    }>;
    markAsPaid(paymentId: string, adminUserId: string, externalId?: string): Promise<{
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
    } | null>;
    findMyPayments(userId: string, status?: string, page?: number, limit?: number): Promise<{
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
    findById(id: string): Promise<{
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
    }>;
    assertOwnership(paymentUserId: string, currentUserId: string): void;
}
