import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

export const convertEntityToPhotonFeatureDto = (entity: PhotonFeature) => {
  const { geometry, favorite, ...properties } = entity;

  return {
    type: 'Feature',
    geometry,
    properties,
  };
};
