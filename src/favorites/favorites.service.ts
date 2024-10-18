import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { AbilityModule } from '@/casl/casl.module';
import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { UpdateFavoriteDto } from '@/favorites/dto/update-favorite.dto';
import { Favorite } from '@/favorites/entities/favorite.entity';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private readonly favoritesRepository: Repository<Favorite>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto, user: User): Promise<Favorite> {
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const favorite = this.favoritesRepository.create({ ...createFavoriteDto, user });

    return this.favoritesRepository.save(favorite);
  }

  async findAll(user: User) {
    const { id } = user;

    return this.favoritesRepository.find({ where: { user: { id } } });
  }

  async findOne(favoriteId: string, user: User) {
    // const user = await this.usersRepository.findOneByOrFail({ id: userId });

    return this.favoritesRepository.findOneByOrFail({ id: favoriteId });
  }

  async update(id: string, updateFavoriteDto: UpdateFavoriteDto, user: User) {
    const favorite = await this.favoritesRepository.findOneByOrFail({ id });
    // const ability = this.abilityFactory.defineAbility(user);
    //
    // const isAllowed = ability.can(Action.Update, favorite);
    // console.log(isAllowed, 'isAllowed');
    // if (!isAllowed) {
    //   throw new ForbiddenException('You are not allowed to update a favorite');
    // }

    return this.favoritesRepository.save(Object.assign(favorite, updateFavoriteDto));
  }

  async remove(favoriteId: string, user: User) {
    const favorite = await this.favoritesRepository.findOneByOrFail({ id: favoriteId });

    return this.favoritesRepository.remove(favorite);
  }
}
