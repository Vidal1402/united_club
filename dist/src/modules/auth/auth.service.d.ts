import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
export interface TokenPair {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private config;
    constructor(usersService: UsersService, jwtService: JwtService, config: ConfigService);
    validateUser(email: string, _password: string): Promise<{
        id: string;
        email: string;
        role: string;
    } | null>;
    login(email: string, password: string): Promise<TokenPair>;
    refresh(refreshToken: string): Promise<TokenPair>;
    private generateTokens;
}
