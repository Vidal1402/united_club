import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProposalsService } from './proposals.service';
import { CreateProposalDto } from './dto/create-proposal.dto';
import { ApproveProposalDto } from './dto/approve-proposal.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/types/auth.types';
import { Role } from '@prisma/client';
import { ProposalStatus } from '@prisma/client';

@ApiTags('proposals')
@Controller('proposals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar proposta' })
  async create(@Body() dto: CreateProposalDto) {
    return this.proposalsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar propostas (admin: todos; afiliado: suas)' })
  async list(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: ProposalStatus,
    @Query('profileId') profileId?: string,
    @CurrentUser() user?: JwtPayload,
  ) {
    const filterProfileId =
      user?.role === 'admin'
        ? profileId
        : await this.proposalsService.resolveProfileIdForUser(user!.sub, profileId);
    const result = await this.proposalsService.findMany(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      status,
      filterProfileId,
    );
    return { data: result.data, meta: { total: result.total } };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Proposta por ID' })
  async findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    const proposal = await this.proposalsService.findById(id);
    const profileUserId = await this.proposalsService.getProfileUserIdByProposalId(id);
    this.proposalsService.assertOwnership(profileUserId ?? '', user.sub, user.role === 'admin');
    return proposal;
  }

  @Post(':id/approve')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Aprovar proposta (admin) - gera comissoes e atualiza jornada' })
  async approve(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.proposalsService.approve(id, user.sub);
  }

  @Post(':id/reject')
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  @ApiOperation({ summary: 'Rejeitar proposta (admin)' })
  async reject(
    @Param('id') id: string,
    @Body() dto: ApproveProposalDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.proposalsService.reject(id, user.sub, dto.rejectionReason);
  }
}
