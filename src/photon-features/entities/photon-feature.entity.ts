import { Column, Entity, OneToOne } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { Favorite } from '@/favorites/entities/favorite.entity';

@Entity({ name: 'app_photon_feature' })
export class PhotonFeature extends BaseEntity {
  // @IsNotEmpty()
  @Column({ type: 'varchar', default: 'Feature' })
  photon_feature_type: string;

  @Column({ type: 'varchar' })
  geometry_type: string;

  @Column({ type: 'float' })
  geometry_coordinates_x: number;

  @Column({ type: 'float' })
  geometry_coordinates_y: number;

  @Column({ type: 'float' })
  property_osm_id: number;

  @Column({ type: 'varchar' })
  property_osm_type: string;

  @Column({ type: 'jsonb', nullable: true })
  property_extent?: Array<number>;

  @Column({ type: 'varchar', nullable: true })
  property_country?: string;

  @Column({ type: 'varchar', nullable: true })
  property_osm_key?: string;

  @Column({ type: 'varchar', nullable: true })
  property_city?: string;

  @Column({ type: 'varchar', nullable: true })
  property_countrycode?: string;

  @Column({ type: 'varchar', nullable: true })
  property_osm_value?: string;

  @Column({ type: 'varchar', nullable: true })
  property_postcode?: string;

  @Column({ type: 'varchar', nullable: true })
  property_name?: string;

  @Column({ type: 'varchar', nullable: true })
  property_state?: string;

  @Column({ type: 'varchar', nullable: true })
  property_street?: string;

  @Column({ type: 'varchar', nullable: true })
  property_housenumber?: string;

  @Column({ type: 'varchar', nullable: true })
  property_locality?: string;

  @Column({ type: 'varchar', nullable: true })
  property_county?: string;

  @Column({ type: 'varchar', nullable: true })
  property_district?: string;

  @Column({ type: 'varchar', nullable: true })
  property_type?: string;

  @OneToOne(() => Favorite, (favorite) => favorite.photonFeature, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'favorite_id' })
  favorite: Favorite;
}
