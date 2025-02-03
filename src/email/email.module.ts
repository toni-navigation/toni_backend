import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailService } from '@/email/email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com', // Gmail SMTP-Host
        port: process.env.SMTP_PORT || 587, // Port 587 für TLS
        secure: process.env.SMTP_SECURE === 'true' || false, // sicherer Modus (SSL/TLS)
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        tls: {
          rejectUnauthorized: false, // Vermeidet SSL-Zertifikatsprobleme bei Heroku
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
