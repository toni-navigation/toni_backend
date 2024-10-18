import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AbilityModule } from '@/casl/casl.module';
import { Favorite } from '@/favorites/entities/favorite.entity';
import { FavoritesController } from '@/favorites/favorites.controller';
import { FavoritesService } from '@/favorites/favorites.service';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), UsersModule, AbilityModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
