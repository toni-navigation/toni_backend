import { PartialType } from '@nestjs/swagger';

import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';

export class UpdatePhotonFeatureDto extends PartialType(CreatePhotonFeatureDto) {}
