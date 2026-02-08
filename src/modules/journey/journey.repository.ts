import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AffiliateProgress, JourneyLevel } from '@prisma/client';

@Injectable()
export class JourneyRepository {
  constructor(private prisma: PrismaService) {}

  async getOrCreateProgress(userId: string): Promise<AffiliateProgress> {
    let progress = await this.prisma.affiliateProgress.findUnique({
      where: { userId },
      include: { currentLevel: true },
    });
    if (!progress) {
      progress = await this.prisma.affiliateProgress.create({
        data: { userId },
        include: { currentLevel: true },
      });
    }
    return progress;
  }

  async getAllLevels(): Promise<JourneyLevel[]> {
    return this.prisma.journeyLevel.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async updateTotalSales(userId: string, additionalSales: number): Promise<AffiliateProgress> {
    const progress = await this.getOrCreateProgress(userId);
    const newTotal = Number(progress.totalSales) + additionalSales;
    const levels = await this.getAllLevels();
    let currentLevelId = progress.currentLevelId;
    let lastLevelUpAt = progress.lastLevelUpAt;
    for (const level of levels) {
      if (Number(level.minSales) <= newTotal) {
        if (level.id !== currentLevelId) {
          lastLevelUpAt = new Date();
          currentLevelId = level.id;
        }
      }
    }
    return this.prisma.affiliateProgress.update({
      where: { userId },
      data: {
        totalSales: newTotal,
        currentLevelId,
        lastLevelUpAt,
      },
      include: { currentLevel: true },
    });
  }

  async getProgress(userId: string) {
    const progress = await this.getOrCreateProgress(userId);
    const levels = await this.getAllLevels();
    const currentOrder = (progress as { currentLevel?: { order: number } }).currentLevel?.order ?? 0;
    const nextLevel = levels.find((l) => l.order === currentOrder + 1);
    return {
      progress,
      levels,
      nextLevel,
      totalSales: Number(progress.totalSales),
    };
  }
}
