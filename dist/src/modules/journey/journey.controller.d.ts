import { JourneyService } from './journey.service';
import type { JwtPayload } from '../../common/types/auth.types';
export declare class JourneyController {
    private readonly journeyService;
    constructor(journeyService: JourneyService);
    me(user: JwtPayload): Promise<{
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
    levels(): Promise<{
        id: string;
        slug: string;
        name: string;
        minSales: number;
        order: number;
        createdAt: Date;
    }[]>;
}
