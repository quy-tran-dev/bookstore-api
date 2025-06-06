import { Module } from '@nestjs/common';
import { LoggerService } from '@app/common/services/logger.service';
import { BullModule } from '@nestjs/bull';
import { AuthMailerService } from './auth-mailer.service';
import { AuthMailProcessor } from './auth-mailer.processor';
import { AuthMailProducer } from './auth-mailer.producer';
import { DiscordLogService } from '@app/modules/discord-notify/log-discord.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'authQueue',
    }),
  ],
  providers: [
    LoggerService,
    AuthMailerService,
    AuthMailProcessor,
    AuthMailProducer,
    DiscordLogService,
  ],
  exports: [AuthMailProducer],
})
export class AuthMailModule {}
