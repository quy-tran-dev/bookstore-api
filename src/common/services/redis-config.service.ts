import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SharedBullConfigurationFactory,
  BullRootModuleOptions,
} from '@nestjs/bull';

@Injectable()
export class RedisConfigService implements SharedBullConfigurationFactory {
  constructor(private configService: ConfigService) {}

  /**
   * Phương thức này được NestJS Bull gọi để lấy cấu hình gốc của Bull.
   * Cần trả về đối tượng BullRootModuleOptions đầy đủ, chứa cả cấu hình Redis.
   */
  createSharedConfiguration(): BullRootModuleOptions {
    return {
      redis: {
        host: this.configService.get<string>('REDIS_HOST') || 'localhost',
        port: parseInt(this.configService.get<string>('REDIS_PORT') || '6379'),
        db: parseInt(this.configService.get<string>('REDIS_DB') || '0'),
        password: this.configService.get<string>('REDIS_PASSWORD') || undefined,
      },
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
