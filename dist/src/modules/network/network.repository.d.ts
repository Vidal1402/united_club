import { PrismaService } from '../../prisma/prisma.service';
import { AffiliateNetwork, Prisma } from '@prisma/client';
export declare class NetworkRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.AffiliateNetworkCreateInput): Promise<AffiliateNetwork>;
    findUplines(affiliateId: string, maxLevel?: number): Promise<{
        referrerId: string;
        level: number;
    }[]>;
    findDownlines(referrerId: string, level?: number): Promise<AffiliateNetwork[]>;
    countDownlines(referrerId: string): Promise<number>;
}
