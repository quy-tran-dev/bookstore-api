import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NormalMail } from './interfaces/normal-mail.interface';

@Injectable()
export class MailProducer {
  constructor(@InjectQueue('authQueue') private mailQueue: Queue) {}

  async sendWelcomeEmail({
    to,
    userName,
    verificationToken,
  }: NormalMail): Promise<void> {
    await this.mailQueue.add('sendWelcomeEmail', {
      to: to,
      userName: userName,
      verificationToken: verificationToken,
    } as NormalMail);
  }
}
