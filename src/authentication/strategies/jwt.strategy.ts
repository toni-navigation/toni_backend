import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { BlacklistService } from '@/blacklist/blacklist.service';
import { EnvironmentVariables } from '@/types/EnvironmentVariables';
import { JwtPayload } from '@/types/JwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly blacklistService: BlacklistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET', { infer: true }),
      passReqToCallback: true,
    });
  }

  async validate(payload: JwtPayload, request: Request) {
    console.log(JSON.stringify(request));
    const authHeader = request.headers?.get('authorization');
    console.log(authHeader);
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    if (token && this.blacklistService.isBlacklisted(token)) {
      throw new UnauthorizedException('Token has been blacklisted');
    }

    return { id: payload.user.id, email: payload.user.email, role: payload.user.role };
  }
}
