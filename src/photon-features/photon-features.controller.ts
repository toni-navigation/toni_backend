import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';
import { PhotonFeaturesService } from '@/photon-features/photon-features.service';

@ApiTags('PhotonFeatures')
@Controller('photon-features')
export class PhotonFeaturesController {
  constructor(private readonly photonFeaturesService: PhotonFeaturesService) {}

  @Post()
  create(@Body() createPhotonFeatureDto: CreatePhotonFeatureDto) {
    return this.photonFeaturesService.createPhotonFeature(createPhotonFeatureDto);
  }

  @Get(':photonFeatureId')
  findOne(@Param('photonFeatureId') photonFeatureId: string) {
    return this.photonFeaturesService.findOnePhotonFeature(photonFeatureId);
  }

  @Patch(':photonFeatureId')
  update(@Param('photonFeatureId') photonFeatureId: string, @Body() updatePhotonFeatureDto: CreatePhotonFeatureDto) {
    return this.photonFeaturesService.updatePhotonFeature(photonFeatureId, updatePhotonFeatureDto);
  }

  @Delete(':photonFeatureId')
  remove(@Param('photonFeatureId') photonFeatureId: string) {
    return this.photonFeaturesService.removePhotonFeature(photonFeatureId);
  }
}
