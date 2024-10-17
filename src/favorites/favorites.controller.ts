import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { UpdateFavoriteDto } from '@/favorites/dto/update-favorite.dto';
import { FavoritesService } from '@/favorites/favorites.service';
import { RequestWithUser } from '@/types/RequestWithUser';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Req() req: RequestWithUser) {
    return this.favoritesService.create(createFavoriteDto, req.user);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.favoritesService.findAll(req.user.id);
  }

  @Get(':favoriteId')
  findOne(@Param('favoriteId') favoriteId: string) {
    return this.favoritesService.findOne(favoriteId);
  }

  @Patch(':favoriteId')
  update(@Param('favoriteId') favoriteId: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    return this.favoritesService.update(favoriteId, updateFavoriteDto);
  }

  @Delete(':favoriteId')
  remove(@Param('favoriteId') favoriteId: string) {
    return this.favoritesService.remove(favoriteId);
  }
}
