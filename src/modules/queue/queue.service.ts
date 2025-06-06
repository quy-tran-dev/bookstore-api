import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('mail') private readonly mailQueue: Queue) {}

  async enqueueWelcomeMail(email: string) {
    await this.mailQueue.add('send-welcome-email', { email });
  }
}
