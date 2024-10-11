import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { UpdateFavoriteDto } from '@/favorites/dto/update-favorite.dto';
import { Favorite } from '@/favorites/entities/favorite.entity';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private readonly favoritesRepository: Repository<Favorite>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto, user: User): Promise<Favorite> {
    // const user = await this.usersRepository.findOne(user);
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const favorite = this.favoritesRepository.create({ ...createFavoriteDto, user });

    return this.favoritesRepository.save(favorite);
  }

  findAll() {
    return this.favoritesRepository.find();
  }

  findOne(id: string) {
    return this.favoritesRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateFavoriteDto: UpdateFavoriteDto) {
    const favorite = await this.favoritesRepository.findOneByOrFail({ id });

    return this.favoritesRepository.save(Object.assign(favorite, updateFavoriteDto));
  }

  async remove(id: string) {
    const favorite = await this.favoritesRepository.findOneByOrFail({ id });

    return this.favoritesRepository.remove(favorite);
  }
}