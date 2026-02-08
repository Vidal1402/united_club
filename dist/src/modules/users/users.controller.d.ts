import { UsersService } from './users.service';
import { Role } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    list(page?: string, limit?: string, role?: Role): Promise<{
        data: {
            id: string;
            createdAt: Date;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            isActive: boolean;
            updatedAt: Date;
        }[];
        meta: {
            total: number;
        };
    }>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        isActive: boolean;
        updatedAt: Date;
    } | null>;
}
