import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { MailProcessor } from '../mailer/mail.processor';
import { BullConfigService } from '@app/common/configs/bull.config';

@Module({
  imports: [
     BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
  ],
  providers: [QueueService, MailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
