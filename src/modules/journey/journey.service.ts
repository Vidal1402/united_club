import { Injectable } from '@nestjs/common';
import { JourneyRepository } from './journey.repository';

@Injectable()
export class JourneyService {
  constructor(private repository: JourneyRepository) {}

  async addSalesAndUpdateLevel(userId: string, saleValue: number) {
    return this.repository.updateTotalSales(userId, saleValue);
  }

  async getMyProgress(userId: string) {
    return this.repository.getProgress(userId);
  }

  async getAllLevels() {
    return this.repository.getAllLevels();
  }
}
