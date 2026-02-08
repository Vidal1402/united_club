import { DashboardService } from './dashboard.service';
import type { JwtPayload } from '../../common/types/auth.types';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    me(user: JwtPayload): Promise<{
        totalSales: number;
        totalCommissions: number;
        nextPayment: {
            id: string;
            amount: number;
            type: import(".prisma/client").$Enums.PaymentType;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
        } | null;
        journey: {
            progress: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                totalSales: number;
                lastLevelUpAt: Date | null;
                currentLevelId: string | null;
            };
            levels: {
                id: string;
                slug: string;
                name: string;
                minSales: number;
                order: number;
                createdAt: Date;
            }[];
            nextLevel: {
                id: string;
                slug: string;
                name: string;
                minSales: number;
                order: number;
                createdAt: Date;
            } | undefined;
            totalSales: number;
        };
        network: {
            totalDownlines: number;
            level1: number;
            level2: number;
            level3: number;
        };
    }>;
}
