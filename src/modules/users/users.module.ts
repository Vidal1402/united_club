import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { DashboardModule } from '../dashboard/dashboard.module';
import { CommissionsModule } from '../commissions/commissions.module';
import { ProposalsModule } from '../proposals/proposals.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [DashboardModule, CommissionsModule, ProposalsModule, ProfilesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
