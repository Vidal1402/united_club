import * as bcrypt from 'bcrypt';
import { ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { UsersService } from '../users/users.service';
import type { JwtPayload } from '../../common/types/auth.types';

const SALT_ROUNDS = 10;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResult extends TokenPair {
  user: { id: string; email: string; role: string; fullName?: string };
}

export interface RegisterResult extends TokenPair {
  user: { id: string; email: string; role: string; fullName: string };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<{ id: string; email: string; role: string } | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) return null;
    const hash = (user as { passwordHash?: string | null }).passwordHash;
    if (!hash) return null;
    const ok = await bcrypt.compare(password, hash);
    if (!ok) return null;
    return { id: user.id, email: user.email, role: user.role };
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    if (!user.isActive) {
      throw new ForbiddenException('ACCOUNT_PENDING');
    }
    const hash = (user as { passwordHash?: string | null }).passwordHash;
    if (!hash) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const ok = await bcrypt.compare(password, hash);
    if (!ok) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const validated = { id: user.id, email: user.email, role: user.role };
    const tokens = this.generateTokens(validated);
    const userWithProfile = await this.usersService.findById(validated.id) as { profile?: { fullName: string } | null } | null;
    const fullName = userWithProfile?.profile?.fullName;
    return {
      ...tokens,
      user: {
        id: validated.id,
        email: validated.email,
        role: validated.role,
        fullName,
      },
    };
  }

  async register(
    email: string,
    password: string,
    fullName: string,
    phone?: string,
  ): Promise<RegisterResult> {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    let user: Awaited<ReturnType<UsersService['createForRegister']>>;
    try {
      user = await this.usersService.createForRegister({
        email,
        passwordHash,
        fullName,
        phone,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('E-mail já cadastrado');
      }
      throw err;
    }
    const profile = user.profile;
    const tokens = this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        fullName: profile?.fullName ?? fullName,
      },
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.usersService.findById(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Token inválido');
      }
      return this.generateTokens({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  private generateTokens(user: { id: string; email: string; role: string }): TokenPair {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    const expiresIn = 15 * 60; // 15 min em segundos
    return { accessToken, refreshToken, expiresIn };
  }
}
