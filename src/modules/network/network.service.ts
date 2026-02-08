import { Injectable } from '@nestjs/common';
import { NetworkRepository } from './network.repository';

@Injectable()
export class NetworkService {
  constructor(private repository: NetworkRepository) {}

  async getUplines(affiliateId: string, maxLevel: number = 3) {
    return this.repository.findUplines(affiliateId, maxLevel);
  }

  async getDownlines(userId: string, level?: number) {
    return this.repository.findDownlines(userId, level);
  }

  async getNetworkStats(userId: string) {
    const total = await this.repository.countDownlines(userId);
    const level1 = await this.repository.findDownlines(userId, 1);
    const level2 = await this.repository.findDownlines(userId, 2);
    const level3 = await this.repository.findDownlines(userId, 3);
    return {
      totalDownlines: total,
      level1: level1.length,
      level2: level2.length,
      level3: level3.length,
    };
  }
}
