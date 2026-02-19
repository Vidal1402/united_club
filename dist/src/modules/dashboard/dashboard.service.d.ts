import { PrismaService } from '../../prisma/prisma.service';
import { CommissionsService } from '../commissions/commissions.service';
import { JourneyService } from '../journey/journey.service';
import { NetworkService } from '../network/network.service';
export declare class DashboardService {
    private prisma;
    private commissionsService;
    private journeyService;
    private networkService;
    constructor(prisma: PrismaService, commissionsService: CommissionsService, journeyService: JourneyService, networkService: NetworkService);
    getMyDashboard(userId: string): Promise<{
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
                createdAt: Date;
                name: string;
                slug: string;
                minSales: number;
                order: number;
            }[];
            nextLevel: {
                id: string;
                createdAt: Date;
                name: string;
                slug: string;
                minSales: number;
                order: number;
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
    private getTotalSales;
    private getNextPayment;
}
