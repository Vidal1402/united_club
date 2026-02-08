import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { CommissionsModule } from '../commissions/commissions.module';
import { JourneyModule } from '../journey/journey.module';
import { NetworkModule } from '../network/network.module';

@Module({
  imports: [CommissionsModule, JourneyModule, NetworkModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
