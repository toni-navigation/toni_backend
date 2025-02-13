import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Query,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthenticationService } from '@/authentication/authentication.service';
import { Public } from '@/authentication/decorators/public.decorator';
import { LoginUserDto } from '@/authentication/dto/login-user.dto';
import { LocalAuthenticationGuard } from '@/authentication/guards/local-authentication.guard';
import { RequestWithUser } from '@/types/RequestWithUser';
import { CreateUserResponseDto } from '@/users/dto/create-user-response.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Public()
  @Post()
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 201, type: CreateUserResponseDto })
  async login(@Request() request: RequestWithUser) {
    const { user: currentUser } = request;
    if (!currentUser) {
      throw new UnauthorizedException('No user found in request');
    }

    return this.authenticationService.login(request.user);
  }

  @Public()
  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string, @Res() res: Response) {
    const redirectUrl = await this.authenticationService.confirmEmail(token);

    console.log('redirectUrl', redirectUrl);

    return res.redirect(redirectUrl);
  }

  @Get()
  @ApiBearerAuth('access-token')
  getUser(@Request() request: RequestWithUser) {
    return this.authenticationService.getAuthenticatedUser(request.user.id, request.user);

    // return request.user;
  }

  @Delete()
  @HttpCode(204)
  @ApiBearerAuth('access-token')
  async logout(@Request() request: RequestWithUser) {
    this.authenticationService.setJwtCookieLogout(request);
  }

  @Public()
  @Post('forgot-password')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'user@example.com',
          description: 'The email address of the user who wants to reset their password.',
        },
      },
      required: ['email'],
    },
  })
  async forgotPassword(@Body() { email }: { email: string }): Promise<void> {
    return this.authenticationService.forgotPassword(email);
  }
}
