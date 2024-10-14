import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { PhotonFeatureDto } from '@/favorites/dto/photon-feature.dto';
import { FavoriteType } from '@/favorites/enums/favorite-type.enum';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(FavoriteType)
  type: FavoriteType;

  @ValidateNested()
  @Type(() => PhotonFeatureDto)
  photonFeature: PhotonFeatureDto;
}
