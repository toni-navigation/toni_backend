import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailService } from '@/email/email.service';
import { EnvironmentVariables } from '@/types/EnvironmentVariables';

const configService = new ConfigService<EnvironmentVariables, true>();

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: configService.get('SMTP_HOST', { infer: true }) || "localhost", // Gmail SMTP-Host
        port: configService.get('SMTP_PORT', { infer: true }) || 1025, // Port 587 für TLS
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
