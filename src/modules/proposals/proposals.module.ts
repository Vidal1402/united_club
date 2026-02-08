import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { ProposalsController } from './proposals.controller';
import { ProposalsRepository } from './proposals.repository';
import { NetworkModule } from '../network/network.module';
import { CommissionsModule } from '../commissions/commissions.module';
import { JourneyModule } from '../journey/journey.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NetworkModule, CommissionsModule, JourneyModule, NotificationsModule],
  controllers: [ProposalsController],
  providers: [ProposalsService, ProposalsRepository],
  exports: [ProposalsService, ProposalsRepository],
})
export class ProposalsModule {}
