import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import type { JwtPayload } from '../../common/types/auth.types';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    request(dto: CreatePaymentDto, user: JwtPayload): Promise<{
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
    me(user: JwtPayload, status?: string, page?: string, limit?: string): Promise<{
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
        meta: {
            total: number;
        };
    }>;
    findOne(id: string, user: JwtPayload): Promise<{
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
    markPaid(id: string, body: {
        externalId?: string;
    }, user: JwtPayload): Promise<{
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
}
