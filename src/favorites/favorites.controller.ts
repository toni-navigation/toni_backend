import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CheckPolicies } from '@/ability/check-policies.decorator';
import { PoliciesGuard } from '@/ability/policies.guard';
import { Action, AppAbility, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { UpdateFavoriteDto } from '@/favorites/dto/update-favorite.dto';
import { FavoritesService } from '@/favorites/favorites.service';
import { RequestWithUser } from '@/types/RequestWithUser';
import { UsersService } from '@/users/users.service';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Req() req: RequestWithUser) {
    // const ability = this.abilityFactory.defineAbility(req.user);
    //
    // const isAllowed = ability.can(Action.Create, req.user);
    // if (!isAllowed) {
    //   throw new ForbiddenException('You are not allowed to create a favorite');
    // }

    return this.favoritesService.create(createFavoriteDto, req.user);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.favoritesService.findAll(req.user);
  }

  @Get(':favoriteId')
  findOne(@Param('favoriteId') favoriteId: string, @Req() req: RequestWithUser) {
    return this.favoritesService.findOne(favoriteId, req.user);
  }

  @Patch(':favoriteId')
  update(
    @Param('favoriteId') favoriteId: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
    @Req() req: RequestWithUser,
  ) {
    return this.favoritesService.update(favoriteId, updateFavoriteDto, req.user);
  }

  @Delete(':favoriteId')
  remove(@Param('favoriteId') favoriteId: string, @Req() req: RequestWithUser) {
    return this.favoritesService.remove(favoriteId, req.user);
  }
}
