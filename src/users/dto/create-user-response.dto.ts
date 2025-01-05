import { ApiProperty } from '@nestjs/swagger';

import { User } from '@/users/entities/user.entity';

export class CreateUserResponseDto {
  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: String, description: 'JWT access token' })
  accessToken: string;
}
