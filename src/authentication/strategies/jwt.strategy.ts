import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthenticationService } from '@/authentication/authentication.service';
import { EnvironmentVariables } from '@/types/EnvironmentVariables';
import { JwtPayload } from '@/types/JwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly authenticationService: AuthenticationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.[this.configService.get('JWT_COOKIE_NAME', { infer: true })],
      ]),

      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', { infer: true }),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      return await this.authenticationService.validateJwtUser(payload);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
