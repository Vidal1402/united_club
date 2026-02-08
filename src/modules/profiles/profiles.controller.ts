import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/types/auth.types';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('profiles')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Meu perfil' })
  async me(@CurrentUser() user: JwtPayload) {
    return this.profilesService.findByUserId(user.sub);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Perfil por userId (owner ou admin)' })
  async findOne(
    @Param('userId') userId: string,
    @CurrentUser() user: JwtPayload,
  ) {
    if (user.sub !== userId && user.role !== 'admin') {
      return this.profilesService.findByUserId(user.sub);
    }
    return this.profilesService.findByUserId(userId);
  }

  @Put(':userId')
  @UseGuards(RolesGuard)
  @Roles(Role.admin, Role.affiliate)
  @ApiOperation({ summary: 'Atualizar perfil (owner ou admin)' })
  async update(
    @Param('userId') userId: string,
    @Body() dto: UpdateProfileDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.profilesService.update(userId, dto, user.sub);
  }
}
