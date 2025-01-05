import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityModule } from '@/casl/casl.module';
import { EmailModule } from '@/email/email.module';
import { User } from '@/users/entities/user.entity';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AbilityModule, JwtModule, ConfigModule, EmailModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, TypeOrmModule.forFeature([User])],
})
export class UsersModule {}
