import { Transform } from 'class-transformer';
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, RelationId } from 'typeorm';

import { Favorite } from '@/favorites/entities/favorite.entity';
import { PointDto } from '@/photon-features/dto/point.dto';

@Entity()
export class PhotonFeature {
  @RelationId((photonFeature: PhotonFeature) => photonFeature.favorite)
  @PrimaryColumn('uuid')
  favoriteId: string;

  @OneToOne(() => Favorite, (favorite) => favorite.photonFeature, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  @Transform((params) => {
    console.log('Transform in photon-feature.entity.ts', params);
  })
  favorite: Favorite;

  @Index({ spatial: true })
  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geometry: PointDto;

  @Column({ type: 'float' })
  osm_id: number;

  @Column({ type: 'varchar' })
  osm_type: string;

  @Column({ type: 'jsonb', nullable: true })
  extent?: Array<number>;

  @Column({ type: 'varchar', nullable: true })
  country?: string;

  @Column({ type: 'varchar', nullable: true })
  osm_key?: string;

  @Column({ type: 'varchar', nullable: true })
  city?: string;

  @Column({ type: 'varchar', nullable: true })
  countrycode?: string;

  @Column({ type: 'varchar', nullable: true })
  osm_value?: string;

  @Column({ type: 'varchar', nullable: true })
  postcode?: string;

  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ type: 'varchar', nullable: true })
  state?: string;

  @Column({ type: 'varchar', nullable: true })
  street?: string;

  @Column({ type: 'varchar', nullable: true })
  housenumber?: string;

  @Column({ type: 'varchar', nullable: true })
  locality?: string;

  @Column({ type: 'varchar', nullable: true })
  county?: string;

  @Column({ type: 'varchar', nullable: true })
  district?: string;

  @Column({ type: 'varchar', nullable: true })
  type?: string;
}
