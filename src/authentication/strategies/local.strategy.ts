import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthenticationService } from '@/authentication/authentication.service';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<User> {
    try {
      return await this.authenticationService.validateLocalUser(email.toLowerCase(), password);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
