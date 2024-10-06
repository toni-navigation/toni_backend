import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Favorite } from '@/favorites/entities/favorite.entity';
import { FavoritesController } from '@/favorites/favorites.controller';
import { FavoritesService } from '@/favorites/favorites.service';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
