import { JourneyRepository } from './journey.repository';
export declare class JourneyService {
    private repository;
    constructor(repository: JourneyRepository);
    addSalesAndUpdateLevel(userId: string, saleValue: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        totalSales: number;
        lastLevelUpAt: Date | null;
        currentLevelId: string | null;
    }>;
    getMyProgress(userId: string): Promise<{
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
    }>;
    getAllLevels(): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        minSales: number;
        order: number;
    }[]>;
}
