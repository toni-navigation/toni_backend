import { Test, TestingModule } from '@nestjs/testing';

import { PhotonFeaturesService } from '@/photon-features/photon-features.service';

describe('PhotonFeaturesService', () => {
  let service: PhotonFeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotonFeaturesService],
    }).compile();

    service = module.get<PhotonFeaturesService>(PhotonFeaturesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
