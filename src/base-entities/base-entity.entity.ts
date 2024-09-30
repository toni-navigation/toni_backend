import { PrimaryGeneratedColumn } from 'typeorm';

import { TimestampEntity } from '@/base-entities/timestamp-entity.entity';

export abstract class BaseEntity extends TimestampEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
