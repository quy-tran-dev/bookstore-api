// mailer.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService as BaseMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailerService: BaseMailerService) {}

  async sendWelcomeEmail(to: string, name: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Welcome to Bookstore!',
      template: 'welcome', // Tên file handlebars
      context: {
        name,
        siteUrl: 'https://bookstore.com',
      },
    });
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const resetUrl = `https://bookstore.com/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        resetUrl,
      },
    });
  }
}
