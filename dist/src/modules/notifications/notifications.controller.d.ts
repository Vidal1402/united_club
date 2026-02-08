import { NotificationsService } from './notifications.service';
import type { JwtPayload } from '../../common/types/auth.types';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    me(user: JwtPayload, unreadOnly?: string, page?: string, limit?: string): Promise<{
        data: {
            id: string;
            createdAt: Date;
            userId: string;
            type: import(".prisma/client").$Enums.NotificationType;
            title: string;
            body: string | null;
            readAt: Date | null;
            metadata: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        meta: {
            total: number;
        };
    }>;
    markRead(id: string, user: JwtPayload): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        type: import(".prisma/client").$Enums.NotificationType;
        title: string;
        body: string | null;
        readAt: Date | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    markAllRead(user: JwtPayload): Promise<{
        marked: number;
    }>;
}
