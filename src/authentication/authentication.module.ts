import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationController } from '@/authentication/authentication.controller';
import { AuthenticationService } from '@/authentication/authentication.service';
import { JwtAuthenticationGuard } from '@/authentication/guards/jwt-authentication.guard';
import { JwtStrategy } from '@/authentication/strategies/jwt.strategy';
import { LocalStrategy } from '@/authentication/strategies/local.strategy';
import { EmailModule } from '@/email/email.module';
import { EnvironmentVariables } from '@/types/EnvironmentVariables';
import { User } from '@/users/entities/user.entity';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    UsersModule,
    EmailModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        secret: configService.get('JWT_SECRET', { infer: true }),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME', { infer: true }) },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthenticationGuard,
    },
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
