import { IsNumber, IsOptional } from 'class-validator';

export class CreateSettingDto {
  @IsOptional()
  @IsNumber()
  meter: number;

  @IsOptional()
  @IsNumber()
  factor: number;
}
