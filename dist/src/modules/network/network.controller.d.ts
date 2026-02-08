import { NetworkService } from './network.service';
import type { JwtPayload } from '../../common/types/auth.types';
export declare class NetworkController {
    private readonly networkService;
    constructor(networkService: NetworkService);
    me(user: JwtPayload): Promise<{
        uplines: {
            referrerId: string;
            level: number;
        }[];
        downlines: {
            id: string;
            createdAt: Date;
            level: number;
            affiliateId: string;
            referrerId: string;
        }[];
        stats: {
            totalDownlines: number;
            level1: number;
            level2: number;
            level3: number;
        };
    }>;
    myUplines(user: JwtPayload): Promise<{
        referrerId: string;
        level: number;
    }[]>;
    myDownlines(user: JwtPayload, level?: string): Promise<{
        id: string;
        createdAt: Date;
        level: number;
        affiliateId: string;
        referrerId: string;
    }[]>;
    myStats(user: JwtPayload): Promise<{
        totalDownlines: number;
        level1: number;
        level2: number;
        level3: number;
    }>;
    byUser(userId: string, user: JwtPayload): Promise<{
        uplines: {
            referrerId: string;
            level: number;
        }[];
        downlines: {
            id: string;
            createdAt: Date;
            level: number;
            affiliateId: string;
            referrerId: string;
        }[];
        stats: {
            totalDownlines: number;
            level1: number;
            level2: number;
            level3: number;
        };
    }>;
}
