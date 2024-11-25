import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { UpdateFavoriteDto } from '@/favorites/dto/update-favorite.dto';
import { FavoritesService } from '@/favorites/favorites.service';
import { RequestWithUser } from '@/types/RequestWithUser';

@ApiBearerAuth('access-token')
@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  createFavorite(@Body() createFavoriteDto: CreateFavoriteDto, @Req() req: RequestWithUser) {
    const currentUser = req.user;

    return this.favoritesService.createFavorite(createFavoriteDto, currentUser);
  }

  @Get()
  findAllFavorites(@Req() req: RequestWithUser) {
    const currentUser = req.user;

    return this.favoritesService.findAllFavorites(currentUser);
  }

  @Get(':favoriteId')
  findFavoriteById(@Param('favoriteId') favoriteId: string, @Req() req: RequestWithUser) {
    const currentUser = req.user;

    return this.favoritesService.findFavoriteById(favoriteId, currentUser);
  }

  @Patch(':favoriteId')
  updateFavorite(
    @Param('favoriteId') favoriteId: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
    @Req() req: RequestWithUser,
  ) {
    const currentUser = req.user;

    return this.favoritesService.updateFavorite(favoriteId, updateFavoriteDto, currentUser);
  }

  @Delete(':favoriteId')
  deleteFavorite(@Param('favoriteId') favoriteId: string, @Req() req: RequestWithUser) {
    const currentUser = req.user;

    return this.favoritesService.deleteFavorite(favoriteId, currentUser);
  }
}
