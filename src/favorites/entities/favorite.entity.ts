import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { DestinationType } from '@/favorites/enums/favorite-type.enum';
import { CreatePhotonFeatureDto } from '@/photon-features/dto/create-photon-feature.dto';
import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';
import { User } from '@/users/entities/user.entity';

@Entity()
export class Favorite extends BaseEntity {
  @Column('text')
  name: string;

  @Column({
    type: 'enum',
    enum: DestinationType,
    default: DestinationType.NORMAL,
  })
  destinationType: DestinationType;

  // @Transform((params) => {
  //   console.log('Transform in favorite.entity.ts');
  //
  //   // return convertEntityToPhotonFeatureDto(params.value);
  // })
  @OneToOne(() => PhotonFeature, { cascade: ['insert', 'update'] })
  @ApiProperty({ type: CreatePhotonFeatureDto })
  photonFeature: PhotonFeature;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
