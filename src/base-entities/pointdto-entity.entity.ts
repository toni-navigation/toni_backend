import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Point } from 'geojson';

export class PointDto implements Point {
  @IsString()
  @ApiProperty({ oneOf: [{ type: 'string', enum: ['Point'] }] })
  type: 'Point';

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber(undefined, { each: true })
  @Min(-180, { each: true })
  @Max(180, { each: true })
  coordinates: number[];
}
