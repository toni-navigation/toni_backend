import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailService } from '@/email/email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use TLS
        auth: {
          user: 'toni.navigation@gmail.com',
          pass: 'wmpl cqhh jaud uymb', // Use an App Password, not your Gmail password
        },
      },
      defaults: {
        from: '"Toni" <toni.navigation@gmail.com>',
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
