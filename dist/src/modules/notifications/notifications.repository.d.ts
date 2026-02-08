import { PrismaService } from '../../prisma/prisma.service';
import { Notification, NotificationType, Prisma } from '@prisma/client';
export declare class NotificationsRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        userId: string;
        type: NotificationType;
        title: string;
        body?: string;
        metadata?: Record<string, unknown>;
    }): Promise<Notification>;
    findManyByUserId(userId: string, unreadOnly?: boolean, skip?: number, take?: number): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            body: string | null;
            readAt: Date | null;
            metadata: Prisma.JsonValue | null;
        }[];
        total: number;
    }>;
    markAsRead(id: string, userId: string): Promise<Notification>;
    markAllAsRead(userId: string): Promise<number>;
}
