import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { MailProcessor } from '../mailer/mail.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'mail',
    }),
  ],
  providers: [QueueService, MailProcessor],
  exports: [QueueService],
})
export class QueueModule {}
