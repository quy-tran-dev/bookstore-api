import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class MailProducer {
  private readonly logger = new Logger(MailProducer.name);

  constructor(@InjectQueue('emailQueue') private mailQueue: Queue) {} // Inject 'emailQueue'

  async sendVerificationEmail(to: string, verificationToken: string): Promise<void> {
    this.logger.log(`Adding verification email job to emailQueue for ${to}`);
    await this.mailQueue.add(
      'sendVerification',
      { to, verificationToken },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }
}