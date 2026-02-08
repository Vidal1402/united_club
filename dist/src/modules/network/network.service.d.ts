import { NetworkRepository } from './network.repository';
export declare class NetworkService {
    private repository;
    constructor(repository: NetworkRepository);
    getUplines(affiliateId: string, maxLevel?: number): Promise<{
        referrerId: string;
        level: number;
    }[]>;
    getDownlines(userId: string, level?: number): Promise<{
        id: string;
        createdAt: Date;
        level: number;
        affiliateId: string;
        referrerId: string;
    }[]>;
    getNetworkStats(userId: string): Promise<{
        totalDownlines: number;
        level1: number;
        level2: number;
        level3: number;
    }>;
}
