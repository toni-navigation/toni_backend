import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { IsMatchingPassword } from '@/users/decorators/is-password-matching.decorator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Kein gültiges E-Mail-Format'})
  email: string;

  @IsString()
  @MinLength(8, { message: 'Passwort muss mindestens 8 Zeichen haben' })
  password: string;

  @IsString()
  @IsMatchingPassword('password', { message: 'Passwörter müssen übereinstimmen' })
  confirmPassword: string;
}
