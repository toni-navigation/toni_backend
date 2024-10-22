import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { convertPhotonFeatureDtoToEntity } from '@/functions/functions';
import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';
import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

@Injectable()
export class PhotonFeaturesService {
  constructor(
    @InjectRepository(PhotonFeature)
    private photonFeatureRepository: Repository<PhotonFeature>,
  ) {}

  async createPhotonFeature(photonFeatureDto: CreatePhotonFeatureDto) {
    // const {
    //   geometry: photonFeatureGeometry,
    //   properties: photonFeatureProperties,
    //   type: photonFeatureType,
    // } = photonFeatureDto;
    // const suffixedProperties = Object.fromEntries(
    //   Object.entries(photonFeatureProperties).map(([key, value]) => [`property_${key}`, value]),
    // );
    // const [geometryCoordinatesX, geometryCoordinatesY] = photonFeatureGeometry.coordinates; // Array destructuring
    // const photonFeature = this.photonFeatureRepository.create({
    //   photon_feature_type: photonFeatureType,
    //   geometry_coordinates_x: geometryCoordinatesX,
    //   geometry_coordinates_y: geometryCoordinatesY,
    //   geometry_type: photonFeatureGeometry.type,
    //   ...suffixedProperties,
    // });

    return this.photonFeatureRepository.save(
      this.photonFeatureRepository.create(convertPhotonFeatureDtoToEntity(photonFeatureDto)),
    );
  }

  async findOnePhotonFeature(photonFeatureId: string) {
    const dbFeature = await this.photonFeatureRepository.findOneOrFail({ where: { id: photonFeatureId } });
    const newObj = Object.entries(dbFeature).reduce(
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
      type: dbFeature.photon_feature_type,
      geometry: {
        type: dbFeature.geometry_type,
        coordinates: [dbFeature.geometry_coordinates_x, dbFeature.geometry_coordinates_y],
      },
      properties: newObj,
    };
  }

  async updatePhotonFeature(photonFeatureId: string, photonFeatureDto: CreatePhotonFeatureDto) {
    await this.photonFeatureRepository.update(photonFeatureId, convertPhotonFeatureDtoToEntity(photonFeatureDto));

    return this.findOnePhotonFeature(photonFeatureId);
  }

  async removePhotonFeature(photonFeatureId: string) {
    await this.photonFeatureRepository.delete(photonFeatureId);
  }
}
