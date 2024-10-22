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
    const photonFeature = this.photonFeatureRepository.create(photonFeatureDto);

    return this.photonFeatureRepository.save(photonFeature);
  }

  async findOnePhotonFeature(photonFeatureId: string) {
    return this.photonFeatureRepository.findOne({ where: { id: photonFeatureId } });
  }

  async updatePhotonFeature(photonFeatureId: string, photonFeatureDto: CreatePhotonFeatureDto) {
    await this.photonFeatureRepository.update(photonFeatureId, photonFeatureDto);

    return this.findOnePhotonFeature(photonFeatureId);
  }

  async removePhotonFeature(photonFeatureId: string) {
    await this.photonFeatureRepository.delete(photonFeatureId);
  }
}
