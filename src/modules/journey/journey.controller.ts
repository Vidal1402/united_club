import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JourneyService } from './journey.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/types/auth.types';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('journey')
@Controller('journey')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class JourneyController {
  constructor(private readonly journeyService: JourneyService) {}

  @Get('me')
  @ApiOperation({ summary: 'Meu progresso na jornada' })
  async me(@CurrentUser() user: JwtPayload) {
    return this.journeyService.getMyProgress(user.sub);
  }

  @Public()
  @Get('levels')
  @ApiOperation({ summary: 'Lista de níveis (público)' })
  async levels() {
    return this.journeyService.getAllLevels();
  }
}
