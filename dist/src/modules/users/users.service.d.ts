import { UsersRepository } from './users.repository';
import { User, Role } from '@prisma/client';
export declare class UsersService {
    private repository;
    constructor(repository: UsersRepository);
    create(data: {
        email: string;
        role?: Role;
    }): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findMany(params: {
        page?: number;
        limit?: number;
        role?: Role;
    }): Promise<{
        data: {
            id: string;
            createdAt: Date;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            updatedAt: Date;
        }[];
        total: number;
    }>;
}
