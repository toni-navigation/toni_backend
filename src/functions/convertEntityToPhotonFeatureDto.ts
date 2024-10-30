import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

export const convertEntityToPhotonFeatureDto = (entity: PhotonFeature) => {
  const { coordinates, ...properties } = entity;

  return {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates,
    },
    properties,
  };
};
