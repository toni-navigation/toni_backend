import { BeforeInsert, BeforeUpdate, Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '@/base-entities/base-entity.entity';
import { Address } from '@/base-entities/address-entity.entity';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import * as argon2 from '@node-rs/argon2';

@Entity({ name: 'app_user' })
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column('text')
  firstname: string;

  @Column('text')
  lastname: string;

  @Column('text')
  email: string;

  @ApiHideProperty()
  @Exclude()
  @Column('text')
  password: string;

  @Column('boolean')
  initial_registration: boolean;

  @Column(() => Address)
  address: Address;

  @BeforeInsert()
  @BeforeUpdate()
  private emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    this.password = await argon2.hash(this.password);
  }
}
