import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';
import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

export const convertEntityToPhotonFeatureDto = (entity: PhotonFeature) => {
  const properties = Object.entries(entity).reduce(
    (acc, [key, value]) => {
      if (key.startsWith('property_')) {
        const newKey = key.replace('property_', '');
        acc[newKey] = value;
      }

      return acc;
    },
    {} as Record<string, any>,
  );

  return {
    type: entity.photon_feature_type,
    geometry: {
      type: entity.geometry_type,
      coordinates: [entity.geometry_coordinates_x, entity.geometry_coordinates_y],
    },
    properties,
  } as CreatePhotonFeatureDto;
};
