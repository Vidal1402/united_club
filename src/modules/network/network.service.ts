import { BadRequestException, Injectable } from '@nestjs/common';
import { NetworkRepository } from './network.repository';

@Injectable()
export class NetworkService {
  constructor(private repository: NetworkRepository) {}

  /**
   * Vincula um novo afiliado à rede com um indicador (referrer).
   * Cria níveis 1, 2 e 3 na AffiliateNetwork para que comissões multinível funcionem ao aprovar propostas.
   */
  async addAffiliateToNetwork(affiliateId: string, referrerId: string): Promise<void> {
    if (affiliateId === referrerId) {
      throw new BadRequestException('O indicador nao pode ser o proprio usuario');
    }
    await this.repository.create({
      affiliate: { connect: { id: affiliateId } },
      referrer: { connect: { id: referrerId } },
      level: 1,
    });
    const referrerUplines = await this.repository.findUplines(referrerId, 2);
    if (referrerUplines[0]) {
      await this.repository.create({
        affiliate: { connect: { id: affiliateId } },
        referrer: { connect: { id: referrerUplines[0].referrerId } },
        level: 2,
      });
    }
    if (referrerUplines[1]) {
      await this.repository.create({
        affiliate: { connect: { id: affiliateId } },
        referrer: { connect: { id: referrerUplines[1].referrerId } },
        level: 3,
      });
    }
  }

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
