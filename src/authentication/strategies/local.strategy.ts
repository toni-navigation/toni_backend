import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthenticationService } from '@/authentication/authentication.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({ usernameField: 'email', passwordField: 'password', passReqToCallback: true });
  }

  async validate(req: any, email: string, password: string): Promise<any> {
    const user = await this.authenticationService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
