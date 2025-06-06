import { MailerModule as BaseMailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailerService } from './mail.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { LoggerService } from '@app/common/services/logger.service';
import { AuthMailModule } from './auth/auth-mailer.module';
import { BullModule } from '@nestjs/bull';
import { BullConfigService } from '@app/common/configs/bull.config';
import { DiscordLogService } from '../discord-notify/log-discord.service';

@Module({
  imports: [
    
    BaseMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: configService.get<boolean>('MAIL_SECURE'),
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"${configService.get<string>('MAIL_FROM')}" <${configService.get<string>('MAIL_USER')}>`,
        },
        tls: {
          rejectUnauthorized:
            configService.get<string>('NODE_ENV') === 'production', // Tắt kiểm tra chứng chỉ nếu bạn dùng localhost hoặc dev server
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    AuthMailModule,
  ],
  providers: [MailerService, LoggerService, DiscordLogService],
  exports: [MailerService],
})
export class MailModule {}
