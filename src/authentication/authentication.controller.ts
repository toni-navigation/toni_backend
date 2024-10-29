import { Controller, Delete, Get, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticationService } from '@/authentication/authentication.service';
import { Public } from '@/authentication/decorators/public.decorator';
import { LoginUserDto } from '@/authentication/dto/login-user.dto';
import { LocalAuthenticationGuard } from '@/authentication/guards/local-authentication.guard';
import { RequestWithUser } from '@/types/RequestWithUser';
import { User } from '@/users/entities/user.entity';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Public()
  @Post()
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 201, type: User })
  async login(@Request() request: RequestWithUser) {
    const { user } = request;
    this.authenticationService.setJwtCookieLogin(request, user);

    return user;
  }

  @Get()
  @ApiCookieAuth()
  getUser(@Request() request: RequestWithUser) {
    return request.user;
  }

  @Delete()
  @HttpCode(204)
  @ApiCookieAuth()
  async logout(@Request() request: RequestWithUser) {
    this.authenticationService.setJwtCookieLogout(request);
  }
}
