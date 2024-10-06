import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { PointDto } from '@/users/dto/point.dto';

@Entity({ name: 'app_favorite' })
export class Favorite extends BaseEntity {
  @Index({ unique: true })
  @Column('text')
  name: string;

  @Column(() => PointDto)
  geometry: PointDto;
}
