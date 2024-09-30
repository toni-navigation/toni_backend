import { Column } from 'typeorm';

export class Address {
  @Column()
  street: string;

  @Column()
  housenumber: string;

  @Column()
  postalcode: number;

  @Column()
  city: string;

  // Use a string to store the geography data in WKT (Well-Known Text) format
  @Column({ type: 'geography', spatialFeatureType: 'Point', srid: 4326 }) // SRID 4326 for WGS84
  geolocation: string; // or use number[] for coordinates
}
