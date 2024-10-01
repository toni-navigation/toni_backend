import { Column } from 'typeorm';
import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

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

  // Use a string to store the geography data in WKT (Well-Known Text) format
  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 }) // SRID 4326 for WGS84
  geolocation: number[]; // or use number[] for coordinates
}
