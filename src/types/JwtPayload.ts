import { User } from '@/users/entities/user.entity';

export type JwtPayload = {
  user: Pick<User, 'id' | 'email' | 'role'>;
};
