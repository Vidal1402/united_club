import { AuthService, TokenPair } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<import("./auth.service").RegisterResult>;
    login(dto: LoginDto): Promise<TokenPair>;
    refresh(dto: RefreshTokenDto): Promise<TokenPair>;
}
