import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { PointDto } from '@/users/dto/point.dto';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateNested()
  geometry: PointDto;
}
