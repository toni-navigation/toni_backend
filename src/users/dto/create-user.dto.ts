import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { IsMatchingPassword } from '@/users/decorators/is-password-matching.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @IsString()
  @IsMatchingPassword('password', { message: 'Passwords do not match' })
  confirmPassword: string;
}
