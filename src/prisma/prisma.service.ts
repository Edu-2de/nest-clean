import { Env } from '@/env';
import { PrismaClient } from '@/generated/prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService<Env>) {
    const databaseUrl = configService.get('DATABASE_URL', { infer: true });

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    super({
      adapter,
      errorFormat: 'pretty',
      log: ['warn', 'error'],
    });
  }

  async onModuleInit() {
    return await this.$connect();
  }

  async onModuleDestroy() {
    return await this.$disconnect();
  }
}
