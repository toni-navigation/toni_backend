import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticationService } from '@/authentication/authentication.service';
import { Public } from '@/authentication/decorators/public.decorator';
import { LoginUserDto } from '@/authentication/dto/login-user.dto';
import { LocalAuthenticationGuard } from '@/authentication/guards/local-authentication.guard';
import { CreateEmailDto } from '@/email/dto/create-email.dto';
import { EmailService } from '@/email/email.service';
import { RequestWithUser } from '@/types/RequestWithUser';
import { CreateUserResponseDto } from '@/users/dto/create-user-response.dto';
import { ExceptionDto } from '@/users/dto/exception.dto';

@ApiTags('Authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private readonly emailService: EmailService,
  ) {}

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

  @Public()
  @ApiBody({ type: CreateEmailDto })
  @Post('sendConfirmationEmail')
  async sendConfirmationEmail(@Body() body: CreateEmailDto) {
    const { email } = body;

    // Call the email service to send a confirmation email
    await this.emailService.sendEmail(
      email,
      'Confirm Your Email',
      `<p>Thank you for signing up. Click <a href="https://www.toni-navigation.at/confirm?email=${email}">here</a> to confirm your email address.</p>`,
    );

    return { message: 'Signup successful. Please check your email for confirmation.' };
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
}
