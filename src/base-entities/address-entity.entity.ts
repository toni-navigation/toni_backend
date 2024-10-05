import { IsNotEmpty, IsNumber, IsNumberString, IsString, ValidateNested } from 'class-validator';
import { Column, Index } from 'typeorm';

import { PointDto } from '@/users/dto/point.dto';

export class Address {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumberString()
  @IsNotEmpty()
  housenumber: string;

  @IsNumber()
  @IsNotEmpty()
  postalcode: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  // // Use a string to store the geography data in WKT (Well-Known Text) format
  // @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 }) // SRID 4326 for WGS84
  // geolocation: number[]; // or use number[] for coordinates
  @ValidateNested()
  @Index({ spatial: true })
  @Column('geometry', {
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  geometry: PointDto;
}
