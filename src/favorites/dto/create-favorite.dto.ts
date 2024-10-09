import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { PhotonFeature } from '@/favorites/dto/photon-feature.dto';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  isHome: boolean;

  @ValidateNested()
  @Type(() => PhotonFeature)
  photonFeature: PhotonFeature;
}
