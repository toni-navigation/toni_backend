import { Column, Entity, Index, ManyToOne } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { PhotonFeatureDto } from '@/favorites/dto/photon-feature.dto';
import { FavoriteType } from '@/favorites/enum/favorite-type.enum';
import { User } from '@/users/entities/user.entity';

@Entity({ name: 'app_favorite' })
export class Favorite extends BaseEntity {
  @Index({ unique: true })
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

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;
}
