import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

export const convertEntityToPhotonFeatureDto = (entity: PhotonFeature) => {
  const { geometry, favorite, ...properties } = entity;
  const { favoriteId, ...rest } = properties;

  return {
    type: 'Feature',
    geometry,
    properties: rest,
  };
};
