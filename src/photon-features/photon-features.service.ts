import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { convertEntityToPhotonFeatureDto } from '@/functions/convertEntityToPhotonFeatureDto';
import { convertPhotonFeatureDtoToEntity } from '@/functions/convertPhotonFeatureDtoToEntity';
import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';
import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

@Injectable()
export class PhotonFeaturesService {
  constructor(
    @InjectRepository(PhotonFeature)
    private photonFeatureRepository: Repository<PhotonFeature>,
  ) {}

  async createPhotonFeature(photonFeatureDto: CreatePhotonFeatureDto) {
    return this.photonFeatureRepository.save(
      this.photonFeatureRepository.create(convertPhotonFeatureDtoToEntity(photonFeatureDto)),
    );
  }

  async findOnePhotonFeature(photonFeatureId: string) {
    const dbFeature = await this.photonFeatureRepository.findOneOrFail({ where: { id: photonFeatureId } });

    return convertEntityToPhotonFeatureDto(dbFeature);
  }

  async updatePhotonFeature(photonFeatureId: string, photonFeatureDto: CreatePhotonFeatureDto) {
    await this.photonFeatureRepository.update(photonFeatureId, convertPhotonFeatureDtoToEntity(photonFeatureDto));

    return this.findOnePhotonFeature(photonFeatureId);
  }

  async removePhotonFeature(photonFeatureId: string) {
    await this.photonFeatureRepository.delete(photonFeatureId);
  }
}
