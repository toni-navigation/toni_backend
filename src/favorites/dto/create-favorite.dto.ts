import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { DestinationType } from '@/favorites/enums/favorite-type.enum';
import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';

export class CreateFavoriteDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsEnum(DestinationType)
  destinationType: DestinationType;

  @ValidateNested()
  @Type(() => CreatePhotonFeatureDto)
  photonFeature: CreatePhotonFeatureDto;
}
