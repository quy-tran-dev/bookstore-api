import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '../mailer/mail.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/common/services/logger.service';

@Processor('mail')
export class MailProcessor {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private loggerService: LoggerService,
  ) {}

  @Process('sendVerification') // Xử lý job có tên 'sendVerification'
  async handleSendVerification(
    job: Job<{ to: string; userName: string; verificationToken: string }>,
  ) {
    this.loggerService.logDebug(
      'Send mail',
      `Processing verification email job ${job.id} for ${job.data.to}`,
      '',
    );
    try {
      await this.mailerService.sendWelcomeEmail(
        job.data.to,
        job.data.userName,
        job.data.verificationToken,
      );
      this.loggerService.logDebug(
        'Send mail',
        `[Job ${job.id}] Completed.`,
        'result',
      );
    } catch (error) {
      this.onFailed(job, error);
      throw error; // Re-throw để Bull tự động thử lại theo cấu hình "attempts"
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.loggerService.logDebug('Send mail', `[Job ${job.id}] Active`, '');
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    this.loggerService.logDebug(
      'Send mail',
      `[Job ${job.id}] Completed.`,
      result,
    );
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.loggerService.logDebug(
      'Error send mail',
      `[Job ${job.id}] Failed. Error: ${error.message}`,
      error.stack,
    );
  }
}
