import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class PhotonFeaturePropertyDto {
  @IsNumber()
  osm_id: number;

  @IsString()
  osm_type: string;

  @IsOptional()
  @IsArray()
  extent?: number[];

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  osm_key?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  countrycode?: string;

  @IsOptional()
  @IsString()
  osm_value?: string;

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  housenumber?: string;

  @IsOptional()
  @IsString()
  locality?: string;

  @IsOptional()
  @IsString()
  county?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
