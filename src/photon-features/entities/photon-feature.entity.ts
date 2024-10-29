import { Column, Entity, OneToOne } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { Favorite } from '@/favorites/entities/favorite.entity';

@Entity({ name: 'app_photon_feature' })
export class PhotonFeature extends BaseEntity {
  @Column({ type: 'jsonb' })
  coordinates: Array<number>;

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

  @OneToOne(() => Favorite, (favorite) => favorite.photonFeature)
  favorite: Favorite;
}
