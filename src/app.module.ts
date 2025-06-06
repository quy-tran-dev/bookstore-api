import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { providers } from './app.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { typeOrmConfig } from './common/configs/typeorm.config';
import { ApiModule } from './apis/api.module';
import { MailModule } from './modules/mailer/mailer.module';
import { BullModule } from '@nestjs/bull';
import { BullConfigService } from './common/configs/bull.config';

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
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
    ApiModule,
    MailModule,
  ],
  controllers: [AppController],
  providers,
})
export class AppModule {}
