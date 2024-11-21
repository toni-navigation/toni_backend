import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as cookie from 'cookie';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { EnvironmentVariables } from '@/types/EnvironmentVariables';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private configService: ConfigService<EnvironmentVariables, true>,
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    return this.usersService.validateUser(email, password);
  }

  async login(user: User) {
    const payload = { user: { id: user.id, email: user.email, firstname: user.firstname } };

    return {
      access_token: this.jwtService.sign(payload),
      id: user.id,
      email: user.email,
      firstname: user.firstname,
    };
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
