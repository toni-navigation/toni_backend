import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import * as argon2 from '@node-rs/argon2';
import { Exclude } from 'class-transformer';
import { AfterLoad, BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToMany } from 'typeorm';

import { BaseEntity } from '@/base-entities/base-entity.entity';
import { Favorite } from '@/favorites/entities/favorite.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity({ name: 'app_user' })
export class User extends BaseEntity {
  @Column('text', { nullable: true })
  firstname: string | null;

  @Column('text', { nullable: true })
  lastname: string | null;

  @Index({ unique: true })
  @Column('text')
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  @ApiProperty({ enum: UserRole, enumName: 'UserRole' })
  role: UserRole;

  @ApiHideProperty()
  @Exclude()
  @Column('text')
  password: string;

  @Column('double precision', { nullable: true, default: null })
  calibrationFactor: number | null;

  @OneToMany(() => Favorite, (favorite) => favorite.user, { cascade: true, onDelete: 'CASCADE' })
  favorites: Favorite[];

  @ApiHideProperty()
  @Exclude({ toPlainOnly: true })
  previousPassword?: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  private emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @AfterLoad()
  private setPreviousPassword(): void {
    this.previousPassword = this.password;
  }

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.password !== null && this.previousPassword !== this.password) {
      this.password = await argon2.hash(this.password);
    }
  }

  async comparePassword(attempt: string) {
    return argon2.verify(this.password, attempt);
  }
}
