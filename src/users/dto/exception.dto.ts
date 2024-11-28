import { ApiProperty } from '@nestjs/swagger';

export class ExceptionDto {
  @ApiProperty({ type: Number, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({ type: String, description: 'Error message' })
  message: string;

  @ApiProperty({ type: String, description: 'Error type' })
  error: string;
}
