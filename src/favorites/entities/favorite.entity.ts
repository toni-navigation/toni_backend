import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { PhotonFeature } from '@/favorites/dto/photon-feature.dto';
import { User } from '@/users/entities/user.entity';

@Entity({ name: 'app_favorite' })
export class Favorite extends BaseEntity {
  @Index({ unique: true })
  @Column('text')
  name: string;

  @Column('boolean', { default: false })
  isHome: boolean;

  @Column('jsonb')
  photonFeature: PhotonFeature;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;
}
