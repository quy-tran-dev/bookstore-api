import { Injectable } from '@nestjs/common';
import { MailerService as BaseMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@app/common/services/logger.service';
import { NormalMail } from './interfaces/normal-mail.interface';

@Injectable()
export class AuthMailerService {
  constructor(
    private readonly mailerService: BaseMailerService,
    private readonly configService: ConfigService,
    private loggerService: LoggerService,
  ) {}

  private current_year = new Date().getFullYear();
  private website_link = '';
  private contact_link = '';
  private privacy_policy_link = '';

  async sendWelcomeEmail({ to, userName, verificationToken }: NormalMail) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to Bookstore!',
      template: 'welcome',
      context: {
        userName: userName,
        verifyLink: `${this.configService.get<string>('FRONTEND_URL')}/auth/verify-email/${verificationToken}`,
      },
    });
  }

  async sendResetPasswordEmail({
    to,
    userName,
    verificationToken,
  }: NormalMail) {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/auth/reset-password/${verificationToken}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Reset your password at Bookstore',
      template: 'reset-password',
      context: {
        resetUrl: resetUrl,
      },
    });
  }

  async resendVerificationEmail({
    to,
    userName,
    verificationToken,
  }: NormalMail): Promise<void> {
    const verificationLink = `${this.configService.get<string>('FRONTEND_URL')}/auth/verify-email/${verificationToken}`;
    await this.sendMail({
      to: to,
      subject: 'Xác minh tài khoản của bạn',
      template: 'resend-token',
      context: {
        userEmail: to,
        userName: userName,
        verificationLink: verificationLink,
      },
    });
  }

  async sendMail(options: MailOptions): Promise<void> {
    try {
      await this.mailerService.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to: options.to,
        subject: options.subject,
        template: options.template, // Chỉ cần truyền tên template (ví dụ: 'verification')
        context: {
          ...options.context,
          current_year: this.current_year,
          website_link: this.website_link,
          contact_link: this.contact_link,
          privacy_policy_link: this.privacy_policy_link,
        }, // Dữ liệu sẽ được truyền vào template
      });
      this.loggerService.logInfo(
        'Send mail',
        `Email sent to ${options.to} for template ${options.template}`,
      );
    } catch (error) {
      this.loggerService.logDebug(
        'Error send mail',
        `Failed to send email to ${options.to}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
