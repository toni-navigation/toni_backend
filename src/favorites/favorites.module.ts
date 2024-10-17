import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Favorite } from '@/favorites/entities/favorite.entity';
import { FavoritesController } from '@/favorites/favorites.controller';
import { FavoritesService } from '@/favorites/favorites.service';
import { User } from '@/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
