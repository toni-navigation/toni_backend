import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';

export const convertPhotonFeatureDtoToEntity = (photonFeature: CreatePhotonFeatureDto) => {
  const { properties, geometry } = photonFeature;

  return {
    coordinates: geometry.coordinates,
    ...properties,
  };
};
