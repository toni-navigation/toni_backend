import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';
import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

export const convertEntityToPhotonFeatureDto = (entity: PhotonFeature) =>
  ({
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: entity.coordinates,
    },
    properties: {
      osm_id: entity.osm_id,
      osm_type: entity.osm_type,
      osm_key: entity.osm_key,
      osm_value: entity.osm_value,
      extent: entity.extent,
      country: entity.country,
      city: entity.city,
      countrycode: entity.countrycode,
      postcode: entity.postcode,
      name: entity.name,
      state: entity.state,
      street: entity.street,
      housenumber: entity.housenumber,
      locality: entity.locality,
      county: entity.county,
      district: entity.district,
      type: entity.type,
    },
  }) as CreatePhotonFeatureDto;
