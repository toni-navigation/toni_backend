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
import { ExceptionDto } from '@/users/dto/exception.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private authenticationService: AuthenticationService) {}

  @Public()
  @Post()
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 201, type: CreateUserResponseDto })
  @ApiResponse({ status: 403, type: ExceptionDto })
  async login(@Request() request: RequestWithUser) {
    const { user: currentUser } = request;
    if (!currentUser) {
      throw new UnauthorizedException('No user found in request');
    }

    return this.authenticationService.login(request.user);
  }

  // @Public()
  // @ApiBody({ type: CreateEmailDto })
  // @Post('sendConfirmationEmail')
  // async sendConfirmationEmail(@Body() body: CreateEmailDto) {
  //   const { email } = body;
  //
  //   const confirmationUrl = 'https://www.toni-navigation.at';
  //   const emailHtml = await render(EmailConfirmation({ confirmationUrl }));
  //   await this.emailService.sendEmail(email, 'Confirm Your Email', emailHtml);
  //
  //   return { message: 'Signup successful. Please check your email for confirmation.' };
  // }

  @Public()
  @Get('confirm-email')
  async confirmEmail(@Query('token') token: string, @Res() res: Response) {
    const redirectUrl = await this.authenticationService.confirmEmail(token);

    console.log('redirectUrl', redirectUrl);

    // return res.redirect(redirectUrl);
    return res.redirect('https://www.google.at');
  }

  @Get()
  @ApiBearerAuth('access-token')
  getUser(@Request() request: RequestWithUser) {
    return request.user;
  }

  @Delete()
  @HttpCode(204)
  @ApiBearerAuth('access-token')
  async logout(@Request() request: RequestWithUser) {
    this.authenticationService.setJwtCookieLogout(request);
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() { email }: { email: string }): Promise<void> {
    return this.authenticationService.forgotPassword(email);
  }
}
