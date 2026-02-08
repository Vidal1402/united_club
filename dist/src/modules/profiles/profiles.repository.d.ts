import { PrismaService } from '../../prisma/prisma.service';
import { Profile, Prisma } from '@prisma/client';
export declare class ProfilesRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.ProfileCreateInput): Promise<Profile>;
    findById(id: string): Promise<Profile | null>;
    findByUserId(userId: string): Promise<Profile | null>;
    update(id: string, data: Prisma.ProfileUpdateInput): Promise<Profile>;
}
