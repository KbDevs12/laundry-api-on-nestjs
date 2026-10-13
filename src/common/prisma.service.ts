import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Logger } from 'winston';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../generated/prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

type PrismaServiceOptions = Prisma.PrismaClientOptions & {
  log: [
    { emit: 'event'; level: 'query' },
    { emit: 'event'; level: 'info' },
    { emit: 'event'; level: 'warn' },
    { emit: 'event'; level: 'error' },
  ];
};

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaServiceOptions>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not configured');
    }

    const adapter = new PrismaPg({ connectionString });

    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    this.$on('query', (event) => {
      this.logger.debug('Prisma query', {
        query: event.query,
        duration: event.duration,
        target: event.target,
      });
    });

    this.$on('info', (event) => {
      this.logger.info(event.message, {
        target: event.target,
      });
    });

    this.$on('warn', (event) => {
      this.logger.warn(event.message, {
        target: event.target,
      });
    });

    this.$on('error', (event) => {
      this.logger.error(event.message, {
        target: event.target,
      });
    });

    await this.$connect();

    this.logger.info('Prisma connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();

    this.logger.info('Prisma disconnected from database');
  }
}
