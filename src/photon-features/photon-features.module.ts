import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';
import { PhotonFeaturesController } from '@/photon-features/photon-features.controller';
import { PhotonFeaturesService } from '@/photon-features/photon-features.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhotonFeature])],
  controllers: [PhotonFeaturesController],
  providers: [PhotonFeaturesService],
  exports: [PhotonFeaturesService, TypeOrmModule.forFeature([PhotonFeature])],
})
export class PhotonFeaturesModule {}
