import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn, RelationId } from 'typeorm';

import { TimestampEntity } from '@/base-entities/timestamp-entity.entity';
import { Favorite } from '@/favorites/entities/favorite.entity';
import { PointDto } from '@/photon-features/dto/point.dto';

@Entity()
export class PhotonFeature extends TimestampEntity {
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

  @Column({ name: 'favorite_id' })
  @PrimaryColumn('uuid')
  @RelationId((photonFeature: PhotonFeature) => photonFeature.favorite)
  favorite_id: string;

  @OneToOne(() => Favorite, (favorite) => favorite.photonFeature, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'favorite_id' }) // Specify the foreign key column name
  favorite: Favorite;
}
