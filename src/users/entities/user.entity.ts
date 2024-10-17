import { ApiHideProperty } from '@nestjs/swagger';
import * as argon2 from '@node-rs/argon2';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { Favorite } from '@/favorites/entities/favorite.entity';

@Entity({ name: 'app_user' })
export class User extends BaseEntity {
  @Index({ unique: true })
  @Column('text')
  firstname: string;

  @Column('text')
  lastname?: string | null;

  @Index({ unique: true })
  @Column('text')
  email: string;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @ApiHideProperty()
  @Exclude()
  @Column('text')
  password: string;

  @Column('double precision', { nullable: true, default: null })
  calibrationFactor: number | null;

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

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

  async comparePassword(attempt: string) {
    return argon2.verify(this.password, attempt);
  }
}
