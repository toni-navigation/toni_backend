import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';

import { PointDto } from '@/users/dto/point.dto';

export class CreatePhotonFeatureDto {
  @IsNotEmpty()
  type: 'Feature';

  @IsObject()
  @ValidateNested()
  @Type(() => PointDto)
  geometry: PointDto;

  @IsObject()
  @IsNotEmpty()
  readonly properties: {
    name: string;
    [key: string]: any;
  };
}
