import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhotonFeature])],
  exports: [TypeOrmModule.forFeature([PhotonFeature])],
})
export class PhotonFeaturesModule {}
