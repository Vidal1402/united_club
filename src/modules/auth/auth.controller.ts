import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthService, TokenPair } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('register')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  @ApiExcludeEndpoint()
  registerGet() {
    return { statusCode: 405, message: 'Use POST /auth/register com body { email, password, fullName, phone? }' };
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Solicitar acesso (cadastro de afiliado)' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(
      dto.email,
      dto.password,
      dto.fullName,
      dto.phone,
    );
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login (email + senha)' })
  async login(@Body() dto: LoginDto): Promise<TokenPair> {
    return this.authService.login(dto.email, dto.password);
  }

  @Public()
  @Post('refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiOperation({ summary: 'Renovar access token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<TokenPair> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Public()
  @Get('refresh')
  @HttpCode(HttpStatus.METHOD_NOT_ALLOWED)
  @ApiExcludeEndpoint()
  refreshGet() {
    return { statusCode: 405, message: 'Use POST /auth/refresh com body { "refreshToken": "..." }' };
  }
}
