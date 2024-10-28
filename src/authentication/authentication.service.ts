import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as cookie from 'cookie';
import { Request } from 'express';
import { Repository } from 'typeorm';

import { EnvironmentVariables } from '@/types/EnvironmentVariables';
import { JwtPayload } from '@/types/JwtPayload';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(
    private configService: ConfigService<EnvironmentVariables, true>,
    private jwtService: JwtService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  generateJwt(user: User): string {
    const payload = { email: user.email, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async validateLocalUser(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOneOrFail({
      where: { email: email.toLowerCase() },
    });

    if (await user.comparePassword(password)) {
      return user;
    }

    throw new Error('AuthenticationService password mismatch.');
  }

  async validateJwtUser(jwtPayload: JwtPayload) {
    return this.usersRepository.findOneOrFail({
      where: { id: jwtPayload.user.id, email: jwtPayload.user.email },
    });
  }

  setJwtCookieLogin(request: Request, { id, email }: User) {
    const payload: JwtPayload = { user: { id, email } };
    const token = this.jwtService.sign(payload);

    request.res?.setHeader(
      'Set-Cookie',
      this.getSetCookie({
        value: token,
        options: { maxAge: this.configService.get('JWT_EXPIRATION_TIME', { infer: true }) },
      }),
    );
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
