import { Test, TestingModule } from '@nestjs/testing';

import { PhotonFeaturesController } from '@/photon-features/photon-features.controller';
import { PhotonFeaturesService } from '@/photon-features/photon-features.service';

describe('PhotonFeaturesController', () => {
  let controller: PhotonFeaturesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotonFeaturesController],
      providers: [PhotonFeaturesService],
    }).compile();

    controller = module.get<PhotonFeaturesController>(PhotonFeaturesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
