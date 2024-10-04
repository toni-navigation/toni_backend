import { Column } from 'typeorm';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';
import { PointDto } from '@/base-entities/pointdto-entity.entity';

export class Address {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumberString()
  @IsNotEmpty()
  housenumber: string;

  @IsNumberString()
  @IsNotEmpty()
  postalcode: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geometry: PointDto;
}
