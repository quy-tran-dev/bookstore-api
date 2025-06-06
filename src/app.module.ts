import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { providers } from './app.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { ApiModule } from './apis/api.module';
import { AppService } from './app.service';
import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeOrmConfig,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ApiModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers,
})
export class AppModule {}
