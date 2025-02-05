import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { render } from '@react-email/render';
import * as cookie from 'cookie';
import { Request } from 'express';
import { EntityNotFoundError, Repository } from 'typeorm';

import { Action, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { EmailResetPassword } from '@/email/EmailResetPassword';
import { EmailService } from '@/email/email.service';
import { EnvironmentVariables } from '@/types/EnvironmentVariables';
import { CreateUserResponseDto } from '@/users/dto/create-user-response.dto';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private configService: ConfigService<EnvironmentVariables, true>,
    private jwtService: JwtService,
    private usersService: UsersService,
    private emailService: EmailService,
    private abilityFactory: CaslAbilityFactory,

    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      return await this.usersService.validateUser(email, password);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      throw error;
    }
  }

  async getAuthenticatedUser(userId: string, currentUser: User): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({ id: userId });
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (ability.cannot(Action.Read, user)) {
      throw new ForbiddenException('You are not allowed to retrieve this user.');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const confirmationUrl = 'https://www.toni-navigation.at';
    const emailHtml = await render(EmailResetPassword({ confirmationUrl }));
    await this.emailService.sendEmail(user.email, 'Reset password', emailHtml);
  }

  async login(user: User): Promise<CreateUserResponseDto> {
    const payload = {
      user: { id: user.id, email: user.email.toLowerCase(), role: user.role },
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async confirmEmail(token: string) {
    const payload = this.jwtService.verify(token, { secret: this.configService.get('JWT_SECRET') });

    const userId = payload.id;
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`No user found!`);
    } else {
      const newPayload = {
        user: { id: user.id, email: user.email, role: user.role },
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      };

      const newAccessToken = this.jwtService.sign(newPayload);

      return `127.0.0.1://login?token=${newAccessToken}`;
    }
  }

  setJwtCookieLogout(request: Request) {
    request.res?.setHeader(
      'Set-Cookie',
      this.getSetCookie({
        value: '',
        options: { maxAge: 0 },
      }),
    );
  }

  private getSetCookie({
    value,
    options,
  }: {
    value: string;
    options?: Omit<cookie.CookieSerializeOptions, 'httpOnly' | 'path' | 'sameSite' | 'secure'>;
  }) {
    return cookie.serialize(this.configService.get('JWT_COOKIE_NAME', { infer: true }), value, {
      ...options,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: this.configService.get('JWT_COOKIE_SECURE', { infer: true }),
    });
  }
}
