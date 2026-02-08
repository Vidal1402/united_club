import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NetworkService } from './network.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/types/auth.types';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

@ApiTags('network')
@Controller('network')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get('me')
  @ApiOperation({ summary: 'Minha rede (uplines e downlines)' })
  async me(@CurrentUser() user: JwtPayload) {
    const [uplines, downlines, stats] = await Promise.all([
      this.networkService.getUplines(user.sub),
      this.networkService.getDownlines(user.sub),
      this.networkService.getNetworkStats(user.sub),
    ]);
    return { uplines, downlines, stats };
  }

  @Get('me/uplines')
  @ApiOperation({ summary: 'Meus uplines' })
  async myUplines(@CurrentUser() user: JwtPayload) {
    return this.networkService.getUplines(user.sub);
  }

  @Get('me/downlines')
  @ApiOperation({ summary: 'Meus downlines' })
  async myDownlines(@CurrentUser() user: JwtPayload, @Query('level') level?: string) {
    return this.networkService.getDownlines(user.sub, level ? parseInt(level, 10) : undefined);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Estatísticas da rede' })
  async myStats(@CurrentUser() user: JwtPayload) {
    return this.networkService.getNetworkStats(user.sub);
  }

  @Get(':userId')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Rede de um afiliado (admin)' })
  async byUser(@Param('userId') userId: string, @CurrentUser() user: JwtPayload) {
    if (user.role !== 'admin' && user.sub !== userId) {
      throw new ForbiddenException('Acesso negado');
    }
    const [uplines, downlines, stats] = await Promise.all([
      this.networkService.getUplines(userId),
      this.networkService.getDownlines(userId),
      this.networkService.getNetworkStats(userId),
    ]);
    return { uplines, downlines, stats };
  }
}
