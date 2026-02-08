import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/types/auth.types';
import { Role } from '@prisma/client';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('request')
  @ApiOperation({ summary: 'Solicitar saque ou antecipacao' })
  async request(@Body() dto: CreatePaymentDto, @CurrentUser() user: JwtPayload) {
    if (dto.type === 'advance') {
      return this.paymentsService.requestAdvance(user.sub, dto.amount);
    }
    return this.paymentsService.requestWithdrawal(user.sub, dto.amount);
  }

  @Get('me')
  @ApiOperation({ summary: 'Meus pagamentos' })
  async me(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.paymentsService.findMyPayments(
      user.sub,
      status,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
    return { data: result.data, meta: { total: result.total } };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Pagamento por ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const payment = await this.paymentsService.findById(id);
    if (user.role !== 'admin') {
      this.paymentsService.assertOwnership(payment.userId, user.sub);
    }
    return payment;
  }

  @Post(':id/mark-paid')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar pagamento como pago (admin)' })
  async markPaid(
    @Param('id') id: string,
    @Body() body: { externalId?: string },
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.markAsPaid(id, user.sub, body.externalId);
  }
}
