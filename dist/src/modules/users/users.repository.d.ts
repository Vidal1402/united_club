import { PrismaService } from '../../prisma/prisma.service';
import { User, Profile, Prisma } from '@prisma/client';
export declare class UsersRepository {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.UserCreateInput): Promise<User>;
    createUserWithProfile(userData: {
        email: string;
        passwordHash: string;
        role?: 'admin' | 'affiliate';
    }, profileData: {
        fullName: string;
        phone?: string;
    }): Promise<User & {
        profile: Profile | null;
    }>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findMany(params: {
        skip?: number;
        take?: number;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]>;
    count(where?: Prisma.UserWhereInput): Promise<number>;
    update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
}
