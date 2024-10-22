import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';

export const convertPhotonFeatureDtoToEntity = (photonFeature: CreatePhotonFeatureDto) => {
  const { type, properties, geometry } = photonFeature;
  const suffixedProperties = Object.fromEntries(
    Object.entries(properties).map(([key, value]) => [`property_${key}`, value]),
  );
  const [geometryCoordinatesX, geometryCoordinatesY] = geometry.coordinates;

  return {
    photon_feature_type: type,
    geometry_coordinates_x: geometryCoordinatesX,
    geometry_coordinates_y: geometryCoordinatesY,
    geometry_type: geometry.type,
    ...suffixedProperties,
  };
};
