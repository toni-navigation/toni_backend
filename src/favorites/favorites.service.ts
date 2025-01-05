import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

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
    private readonly dataSource: DataSource, // Inject DataSource

    private abilityFactory: CaslAbilityFactory,
  ) {}

  async createFavorite(createFavoriteDto: CreateFavoriteDto, currentUser: User) {
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (ability.cannot(Action.Create, Favorite)) {
      throw new ForbiddenException('You are not allowed to create a favorite.');
    }
    const photonFeatureData = convertPhotonFeatureDtoToEntity(createFavoriteDto.photonFeature);
    const photonFeature = this.photonFeatureRepository.create(photonFeatureData);
    const favorite = this.favoritesRepository.create({
      ...createFavoriteDto,
      user: currentUser,
      photonFeature,
    });

    return this.favoritesRepository.save(favorite);
  }

  async findAllFavorites(currentUser: User) {
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (ability.cannot(Action.Read, Favorite)) {
      throw new ForbiddenException('You are not allowed to read favorites.');
    }

    const result = await this.favoritesRepository.find({
      where: { userId: currentUser.id },
      relations: ['photonFeature'],
    });

    return result.map((favorite) => ({
      ...favorite,
      photonFeature: convertEntityToPhotonFeatureDto(favorite.photonFeature),
    }));
  }

  async findFavoriteById(favoriteId: string, currentUser: User) {
    const photonFeature = await this.photonFeatureRepository.findOneOrFail({
      where: { favoriteId },
      relations: ['favorite'],
    });

    const ability = this.abilityFactory.defineAbility(currentUser);
    if (ability.cannot(Action.Read, photonFeature.favorite)) {
      throw new ForbiddenException('You are not allowed to read this favorite.');
    }

    return {
      ...photonFeature.favorite,
      photonFeature: convertEntityToPhotonFeatureDto(photonFeature),
    };
  }

  async updateFavorite(favoriteId: string, updateFavoriteDto: UpdateFavoriteDto, currentUser: User) {
    const favorite = await this.favoritesRepository.findOneOrFail({
      where: { id: favoriteId },
      relations: ['photonFeature'],
    });

    const ability = this.abilityFactory.defineAbility(currentUser);
    if (ability.cannot(Action.Update, favorite)) {
      throw new ForbiddenException('You are not allowed to update this favorite.');
    }
    const { photonFeature, ...rest } = updateFavoriteDto;
    Object.assign(favorite, rest);

    if (photonFeature && favorite.photonFeature) {
      Object.assign(favorite.photonFeature, convertPhotonFeatureDtoToEntity(photonFeature));
    }

    const savedFavorite = await this.favoritesRepository.save(favorite);

    return {
      ...savedFavorite,
      photonFeature: savedFavorite.photonFeature,
    };
  }

  async deleteFavorite(favoriteId: string, currentUser: User) {
    const photonFeature = await this.photonFeatureRepository.findOneOrFail({
      where: { favoriteId },
      relations: ['favorite'],
    });

    const ability = this.abilityFactory.defineAbility(currentUser);

    if (ability.cannot(Action.Delete, photonFeature.favorite)) {
      throw new ForbiddenException('You are not allowed to delete this favorite.');
    }

    return this.favoritesRepository.remove(photonFeature.favorite);
  }
}
