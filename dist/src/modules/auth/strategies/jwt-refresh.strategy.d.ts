import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '../../users/users.service';
declare const JwtRefreshStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private config;
    private usersService;
    constructor(config: ConfigService, usersService: UsersService);
    validate(req: Request, payload: {
        sub: string;
    }): Promise<{
        sub: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
    } | null>;
}
export {};
