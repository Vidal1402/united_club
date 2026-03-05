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
    setActive(id: string, isActive: boolean): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findMany(params: {
        page?: number;
        limit?: number;
        role?: Role;
        isActive?: boolean;
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
