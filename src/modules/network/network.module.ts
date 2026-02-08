import { Module } from '@nestjs/common';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
import { NetworkRepository } from './network.repository';

@Module({
  controllers: [NetworkController],
  providers: [NetworkService, NetworkRepository],
  exports: [NetworkService, NetworkRepository],
})
export class NetworkModule {}
