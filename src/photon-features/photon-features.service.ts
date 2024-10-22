import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';
import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

@Injectable()
export class PhotonFeaturesService {
  constructor(
    @InjectRepository(PhotonFeature)
    private photonFeatureRepository: Repository<PhotonFeature>,
  ) {}

  async createPhotonFeature(photonFeatureDto: CreatePhotonFeatureDto) {
    const {
      geometry: photonFeatureGeometry,
      properties: photonFeatureProperties,
      type: photonFeatureType,
    } = photonFeatureDto;
    const suffixedProperties = Object.fromEntries(
      Object.entries(photonFeatureProperties).map(([key, value]) => [`property_${key}`, value]),
    );
    const [geometryCoordinatesX, geometryCoordinatesY] = photonFeatureGeometry.coordinates; // Array destructuring
    const photonFeature = this.photonFeatureRepository.create({
      photon_feature_type: photonFeatureType,
      geometry_coordinates_x: geometryCoordinatesX,
      geometry_coordinates_y: geometryCoordinatesY,
      geometry_type: photonFeatureGeometry.type,
      ...suffixedProperties,
    });

    return this.photonFeatureRepository.save(this.photonFeatureRepository.create(photonFeature));
  }

  async findOnePhotonFeature(photonFeatureId: string) {
    const dbFeature = await this.photonFeatureRepository.findOneOrFail({ where: { id: photonFeatureId } });

    // return {
    //   type: dbFeature.photonFeatureType,
    //   geometry: {
    //     type: dbFeature.geometryType,
    //     coordinates: [dbFeature.geometryCoordinatesX, dbFeature.geometryCoordinatesY],
    //   },
    //   properties: {
    //     ...dbFeature,
    //   },
    // };
  }

  async updatePhotonFeature(photonFeatureId: string, photonFeatureDto: CreatePhotonFeatureDto) {
    // await this.photonFeatureRepository.update(photonFeatureId, photonFeatureDto);
    //
    // return this.findOnePhotonFeature(photonFeatureId);
  }

  async removePhotonFeature(photonFeatureId: string) {
    await this.photonFeatureRepository.delete(photonFeatureId);
  }
}
