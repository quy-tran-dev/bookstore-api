import {
  BullModuleOptions,
  SharedBullConfigurationFactory,
} from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullConfigService implements SharedBullConfigurationFactory {
  constructor(private configService: ConfigService) {}
  createSharedConfiguration(): BullModuleOptions {
    return {
      redis: {
        host: this.configService.get<string>('REDIS_HOST') || 'localhost',
        port: parseInt(this.configService.get<string>('REDIS_PORT') || '6379'),
        db: parseInt(this.configService.get<string>('REDIS_DB') || '0'),
        password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      },
      //   prefix: this.configService.get<string>('REDIS_HOST') || 'book_store_queue',
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
      // limiter: {
      //   max: 1000, // Số job tối đa mỗi giây
      //   duration: 1000, // Thời gian (ms) để giới hạn
      // },
    };
  }
}
