import { Injectable, OnModuleInit } from '@nestjs/common'; // Thêm OnModuleInit
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NormalMail } from './interfaces/normal-mail.interface';

@Injectable()
export class AuthMailProducer implements OnModuleInit {
  // Implement OnModuleInit
  private mailQueue: Queue; // Không khởi tạo ở đây

  constructor(@InjectQueue('authQueue') private injectedMailQueue: Queue) {
    // Chỉ lưu lại queue được inject vào một biến tạm thời
  }

  onModuleInit() {
    // Gán queue sau khi module đã được khởi tạo hoàn chỉnh
    this.mailQueue = this.injectedMailQueue;
    if (!this.mailQueue) {
      console.error('AuthMailProducer: mailQueue was not injected!');
    } else {
      console.log('AuthMailProducer: mailQueue injected successfully!');
    }
  }

  async sendWelcomeEmail({
    to: to,
    userName: userName,
    verificationToken: verificationToken,
  }: NormalMail): Promise<void> {
    if (!this.mailQueue) {
      console.error('Attempted to add job before mailQueue was ready.');
      throw new Error('Mail queue not initialized.');
    }
    await this.mailQueue.add('sendWelcomeEmail', {
      to: to,
      userName: userName,
      verificationToken: verificationToken,
    } as NormalMail);
  }

  async sendForgotPasswordEmail({
    to: to,
    userName: userName,
    verificationToken: verificationToken,
  }: NormalMail): Promise<void> {
    if (!this.mailQueue) {
      console.error('Attempted to add job before mailQueue was ready.');
      throw new Error('Mail queue not initialized.');
    }
    await this.mailQueue.add('sendForgotPasswordEmail', {
      to: to,
      userName: userName,
      verificationToken: verificationToken,
    } as NormalMail);
  }

  async resendVerificationEmail({
    to: to,
    userName: userName,
    verificationToken: verificationToken,
  }: NormalMail): Promise<void> {
    if (!this.mailQueue) {
      console.error('Attempted to add job before mailQueue was ready.');
      throw new Error('Mail queue not initialized.');
    }
    await this.mailQueue.add('resendVerificationEmail', {
      to: to,
      userName: userName,
      verificationToken: verificationToken,
    } as NormalMail);
  }

  async sendResetPasswordEmail({
    to: to,
    userName: userName,
    verificationToken: verificationToken,
  }: NormalMail): Promise<void> {
    if (!this.mailQueue) {
      console.error('Attempted to add job before mailQueue was ready.');
      throw new Error('Mail queue not initialized.');
    }
    await this.mailQueue.add('sendResetPasswordEmail', {
      to: to,
      userName: userName,
      verificationToken: verificationToken,
    } as NormalMail);
  }
}
