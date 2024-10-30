import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { UpdateFavoriteDto } from '@/favorites/dto/update-favorite.dto';
import { Favorite } from '@/favorites/entities/favorite.entity';
import { convertEntityToPhotonFeatureDto } from '@/functions/convertEntityToPhotonFeatureDto';
import { convertPhotonFeatureDtoToEntity } from '@/functions/convertPhotonFeatureDtoToEntity';
import { PhotonFeature } from '@/photon-features/entities/photon-feature.entity';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private favoritesRepository: Repository<Favorite>,
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(PhotonFeature) private photonFeatureRepository: Repository<PhotonFeature>,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  async createFavorite(createFavoriteDto: CreateFavoriteDto, currentUser: User) {
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (!ability.can(Action.Create, Favorite)) {
      throw new ForbiddenException('You are not allowed to create a favorite.');
    }

    const photonFeature = this.photonFeatureRepository.create(
      convertPhotonFeatureDtoToEntity(createFavoriteDto.photonFeature),
    );
    await this.photonFeatureRepository.save(photonFeature);

    const favorite = this.favoritesRepository.create({ ...createFavoriteDto, photonFeature, user: currentUser });

    return this.favoritesRepository.save(favorite);
  }

  async findAllFavorites(currentUser: User) {
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (!ability.can(Action.Read, Favorite)) {
      throw new ForbiddenException('You are not allowed to read favorites.');
    }
    const favorites = await this.favoritesRepository.find({
      where: { userId: currentUser.id },
      relations: ['photonFeature'],
    });

    return favorites.map((favorite) => ({
      ...favorite,
      photonFeature: convertEntityToPhotonFeatureDto(favorite.photonFeature),
    }));
  }

  async findFavoriteById(favoriteId: string, currentUser: User) {
    const favorite = await this.favoritesRepository.findOneOrFail({
      where: { id: favoriteId },
      relations: ['photonFeature'],
    });

    const ability = this.abilityFactory.defineAbility(currentUser);
    if (!ability.can(Action.Read, favorite)) {
      throw new ForbiddenException('You are not allowed to read this favorite.');
    }

    return { ...favorite, photonFeature: convertEntityToPhotonFeatureDto(favorite.photonFeature) };
  }

  async updateFavorite(favoriteId: string, updateFavoriteDto: UpdateFavoriteDto, currentUser: User) {
    const favorite = await this.favoritesRepository.findOneOrFail({
      where: { id: favoriteId },
      relations: ['photonFeature'],
    });

    const ability = this.abilityFactory.defineAbility(currentUser);
    if (!ability.can(Action.Update, favorite)) {
      throw new ForbiddenException('You are not allowed to update this favorite.');
    }

    if (updateFavoriteDto.photonFeature) {
      const photonFeature = await this.photonFeatureRepository.findOneByOrFail({ id: favorite.photonFeatureId });
      await this.photonFeatureRepository.save(
        Object.assign(photonFeature, convertPhotonFeatureDtoToEntity(updateFavoriteDto.photonFeature)),
      );
    }

    return this.favoritesRepository.save(Object.assign(favorite, updateFavoriteDto));
  }

  async deleteFavorite(favoriteId: string, currentUser: User) {
    const favorite = await this.favoritesRepository.findOneOrFail({
      where: { id: favoriteId },
    });

    const ability = this.abilityFactory.defineAbility(currentUser);

    if (!ability.can(Action.Delete, favorite)) {
      throw new ForbiddenException('You are not allowed to delete this favorite.');
    }

    const entity = await this.photonFeatureRepository.findOneByOrFail({ id: favorite.photonFeatureId });
    await this.photonFeatureRepository.remove(entity);
  }
}
