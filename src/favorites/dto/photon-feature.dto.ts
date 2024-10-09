import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

import { Properties } from '@/favorites/dto/properties.dto';
import { PointDto } from '@/users/dto/point.dto';

export class PhotonFeature {
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => PointDto)
  geometry: PointDto;

  @ValidateNested()
  @Type(() => Properties)
  properties: Properties;
}
