import { Module } from '@nestjs/common';
import { JourneyService } from './journey.service';
import { JourneyController } from './journey.controller';
import { JourneyRepository } from './journey.repository';

@Module({
  controllers: [JourneyController],
  providers: [JourneyService, JourneyRepository],
  exports: [JourneyService, JourneyRepository],
})
export class JourneyModule {}
