import { PrismaService } from '../../prisma/prisma.service';
import { AffiliateProgress, JourneyLevel } from '@prisma/client';
export declare class JourneyRepository {
    private prisma;
    constructor(prisma: PrismaService);
    getOrCreateProgress(userId: string): Promise<AffiliateProgress>;
    getAllLevels(): Promise<JourneyLevel[]>;
    updateTotalSales(userId: string, additionalSales: number): Promise<AffiliateProgress>;
    getProgress(userId: string): Promise<{
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
    }>;
}
