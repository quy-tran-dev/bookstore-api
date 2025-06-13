import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';

import { LoggerService } from '@app/common/services/logger.service';
import { AuthMailerService } from './auth-mailer.service';
import { NormalMail } from './interfaces/normal-mail.interface';

@Processor('authQueue')
export class AuthMailProcessor {
  constructor(
    private readonly authMailerService: AuthMailerService,
    private loggerService: LoggerService,
  ) {}

  @Process('sendWelcomeEmail') // Xử lý job có tên 'sendWelcomeEmail'
  async handleWelcomeEmail(job: Job<NormalMail>) {
    this.onActive(job);
    try {
      await this.authMailerService.sendWelcomeEmail({
        to: job.data.to,
        userName: job.data.userName,
        verificationToken: job.data.verificationToken,
      });
      this.onCompleted(job, job.data);
    } catch (error) {
      this.onFailed(job, error);
      throw error; // Re-throw để Bull tự động thử lại theo cấu hình "attempts"
    }
  }

  @Process('sendForgotPasswordEmail')
  async handleForgotPasswordEmail(job: Job<NormalMail>) {
    this.onActive(job);
    try {
      await this.authMailerService.sendForgotPasswordEmail({
        to: job.data.to,
        userName: job.data.userName,
        verificationToken: job.data.verificationToken,
      });
      this.onCompleted(job, job.data);
    } catch (error) {
      this.onFailed(job, error);
      throw error; // Re-throw để Bull tự động thuze lai theo cấu hình "attempts"
    }
  }

  @Process('resendVerificationEmail')
  async handleResendVerificationEmail(job: Job<NormalMail>) {
    this.onActive(job);
    try {
      await this.authMailerService.resendVerificationEmail({
        to: job.data.to,
        userName: job.data.userName,
        verificationToken: job.data.verificationToken,
      });
      this.onCompleted(job, job.data);
    } catch (error) {
      this.onFailed(job, error);
      throw error; // Re-throw để Bull tự động thuze lai theo cấu hình "attempts"
    }
  }

  @Process('sendResetPasswordEmail')
  async handleSendResetPasswordEmail(job: Job<NormalMail>) {
    this.onActive(job);
    try {
      await this.authMailerService.sendResetPasswordEmail({
        to: job.data.to,
        userName: job.data.userName,
        verificationToken: job.data.verificationToken,
      });
      this.onCompleted(job, job.data);
    } catch (error) {
      this.onFailed(job, error);
      throw error; // Re-throw để Bull tự động thuze lai theo cấu hình "attempts"
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log('Send mail', `[Job ${job.id}] Active`, '');
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    console.log('Send mail', `[Job ${job.id}] Completed.`, result);
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    console.log(
      'Error send mail',
      `[Job ${job.id}] Failed. Error: ${error.message}`,
      error.stack,
    );
  }
}
