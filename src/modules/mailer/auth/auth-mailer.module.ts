import { Module } from '@nestjs/common';
import { LoggerService } from '@app/common/services/logger.service';
import { BullModule } from '@nestjs/bull';
import { AuthMailerService } from './auth-mailer.service';
import { AuthMailProcessor } from './auth-mailer.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'authQueue',
    }),
  ],
  providers: [LoggerService, AuthMailerService, AuthMailProcessor],
  exports: [AuthMailerService],
})
export class AuthMailModule {}
