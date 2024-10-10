import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { PhotonFeature } from '@/favorites/dto/photon-feature.dto';

@Entity({ name: 'app_favorite' })
export class Favorite extends BaseEntity {
  @Index({ unique: true })
  @Column('text')
  name: string;

  @Column('boolean')
  isHome: boolean;

  @Column('jsonb')
  photonFeature: PhotonFeature;
}
