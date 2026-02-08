import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
export declare class AuditService {
    private prisma;
    constructor(prisma: PrismaService);
    log(params: {
        userId?: string;
        action: string;
        entity: string;
        entityId: string;
        payload?: Record<string, unknown>;
        ip?: string;
        userAgent?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string;
        payload: Prisma.JsonValue | null;
        ip: string | null;
        userAgent: string | null;
    }>;
}
