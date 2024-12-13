import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';

import { PhotonFeaturePropertyDto } from '@/photon-features/dto/photon-feature-property.dto';
import { PointDto } from '@/photon-features/dto/point.dto';

export class CreatePhotonFeatureDto {
  @IsNotEmpty()
  @ApiProperty({ oneOf: [{ type: 'string', enum: ['Feature'] }] })
  type: 'Feature';

  @IsObject()
  @ValidateNested()
  @Type(() => PointDto)
  geometry: PointDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PhotonFeaturePropertyDto)
  @IsNotEmpty()
  properties: PhotonFeaturePropertyDto;
}
