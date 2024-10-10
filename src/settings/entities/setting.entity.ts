import { Column, Entity } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';

@Entity({ name: 'app_setting' })
export class Setting extends BaseEntity {
  @Column('double precision', { nullable: true })
  factor: number | null;

  @Column('double precision', { nullable: true })
  meter: number | null;
}
