import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '../mailer/mail.service';

@Processor('mail')
export class MailProcessor {
  constructor(private readonly mailerService: MailerService) {}

//   @Process('send-welcome-email')
//   async handleWelcomeEmail(job: Job<{ email: string }>) {
//     await this.mailerService.sendWelcomeEmail(job.data.email);
//   }
}
