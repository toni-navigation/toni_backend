import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { PhotonFeatureDto } from '@/favorites/dto/photon-feature.dto';
import { FavoriteType } from '@/favorites/enums/favorite-type.enum';
import { User } from '@/users/entities/user.entity';

@Entity({ name: 'app_favorite' })
export class Favorite extends BaseEntity {
  @Column('text')
  name: string;

  @Column({
    type: 'enum',
    enum: FavoriteType,
    default: FavoriteType.NORMAL,
  })
  type: FavoriteType;

  @Column('jsonb')
  photonFeature: PhotonFeatureDto;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
