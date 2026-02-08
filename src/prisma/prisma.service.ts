import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma conectado ao banco');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma desconectado');
  }

  async cleanDatabase(): Promise<void> {
    if (process.env.NODE_ENV === 'production') return;
    const tx = this as unknown as Record<string, { deleteMany?: () => Promise<unknown> }>;
    const models = ['user', 'profile', 'proposal', 'commission', 'payment', 'notification', 'auditLog'];
    await Promise.all(
      models
        .filter((m) => tx[m]?.deleteMany)
        .map((m) => tx[m].deleteMany!()),
    );
  }
}
