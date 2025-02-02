import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailService } from '@/email/email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        // TODO: port: process.env.SMTP_PORT, does not work somehow
        port: process.env.SMTP_PORT || 587,
        // TODO: port: process.env.SMTP_SECURE, does not work somehow
        secure: process.env.SMTP_SECURE || false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM,
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
