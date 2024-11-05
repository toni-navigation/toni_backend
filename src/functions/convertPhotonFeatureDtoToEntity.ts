import { DeepPartial } from 'typeorm';

import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';
import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

export const convertPhotonFeatureDtoToEntity = (photonFeature: CreatePhotonFeatureDto): DeepPartial<PhotonFeature> => {
  const { properties, geometry } = photonFeature;

  return {
    geometry,
    ...properties,
  };
};
