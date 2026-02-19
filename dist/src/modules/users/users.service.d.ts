import { UsersRepository } from './users.repository';
import { User, Profile, Role } from '@prisma/client';
export declare class UsersService {
    private repository;
    constructor(repository: UsersRepository);
    create(data: {
        email: string;
        passwordHash: string;
        role?: Role;
    }): Promise<User>;
    createForRegister(data: {
        email: string;
        passwordHash: string;
        fullName: string;
        phone?: string;
    }): Promise<User & {
        profile: Profile | null;
    }>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findMany(params: {
        page?: number;
        limit?: number;
        role?: Role;
    }): Promise<{
        data: {
            id: string;
            email: string;
            passwordHash: string | null;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        total: number;
    }>;
}
