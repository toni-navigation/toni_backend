import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { DestinationType } from '@/favorites/enums/favorite-type.enum';
import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';
import { User } from '@/users/entities/user.entity';

@Entity({ name: 'favorites' })
export class Favorite extends BaseEntity {
  @Column('text')
  name: string;

  @Column({
    type: 'enum',
    enum: DestinationType,
    default: DestinationType.NORMAL,
  })
  destinationType: DestinationType;

  @Column({ name: 'photon_feature_id' })
  photonFeatureId: string;

  @OneToOne(() => PhotonFeature, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn({ name: 'photon_feature_id' })
  photonFeature: PhotonFeature;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
