import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Address } from '@/base-entities/address-entity.entity';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  // @ValidateNested()
  // @Type(() => Address)
  // address: Address;
}
