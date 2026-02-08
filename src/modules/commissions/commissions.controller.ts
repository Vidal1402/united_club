import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommissionsService } from './commissions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/types/auth.types';
import { Role, CommissionStatus } from '@prisma/client';

@ApiTags('commissions')
@Controller('commissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommissionsController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get('me')
  @ApiOperation({ summary: 'Minhas comissoes' })
  async me(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: CommissionStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.commissionsService.findMyCommissions(
      user.sub,
      status,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { data: result.data, meta: { total: result.total } };
  }

  @Get('me/balance')
  @ApiOperation({ summary: 'Saldo disponivel (pending)' })
  async balance(@CurrentUser() user: JwtPayload) {
    const balance = await this.commissionsService.getPendingBalance(user.sub);
    return { balance };
  }

  @Get('me/pending')
  @ApiOperation({ summary: 'Comissoes pendentes para saque' })
  async pending(@CurrentUser() user: JwtPayload) {
    return this.commissionsService.getPendingCommissions(user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Comissao por ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const commission = await this.commissionsService.findById(id);
    if (user.role !== 'admin') {
      this.commissionsService.assertOwnership(commission.userId, user.sub);
    }
    return commission;
  }
}
