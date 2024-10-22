import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { UpdateFavoriteDto } from '@/favorites/dto/update-favorite.dto';
import { Favorite } from '@/favorites/entities/favorite.entity';
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

    const { type, properties, geometry } = createFavoriteDto.photonFeature;
    const suffixedProperties = Object.fromEntries(
      Object.entries(properties).map(([key, value]) => [`property_${key}`, value]),
    );
    const [geometryCoordinatesX, geometryCoordinatesY] = geometry.coordinates;
    console.log(suffixedProperties);
    const photonFeature = this.photonFeatureRepository.create({
      photon_feature_type: type,
      geometry_coordinates_x: geometryCoordinatesX,
      geometry_coordinates_y: geometryCoordinatesY,
      geometry_type: geometry.type,
      ...suffixedProperties,
    });
    const savedPhotonFeature = await this.photonFeatureRepository.save(photonFeature);
    const favorite = this.favoritesRepository.create({
      name: createFavoriteDto.name,
      type: createFavoriteDto.type,
      userId: currentUser.id,
      photonFeatureId: savedPhotonFeature.id,
    });

    return this.favoritesRepository.save(favorite);
  }

  async findAllFavorites(currentUser: User) {
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (!ability.can(Action.Read, Favorite)) {
      throw new ForbiddenException('You are not allowed to read favorites.');
    }

    return this.favoritesRepository.findBy({ userId: currentUser.id });
  }

  async findFavoriteById(favoriteId: string, currentUser: User) {
    const favorite = await this.favoritesRepository.findOneByOrFail({ id: favoriteId });

    const ability = this.abilityFactory.defineAbility(currentUser);
    if (!ability.can(Action.Read, favorite)) {
      throw new ForbiddenException('You are not allowed to read this favorite.');
    }

    return favorite;
  }

  async updateFavorite(favoriteId: string, updateFavoriteDto: UpdateFavoriteDto, currentUser: User) {
    const favorite = await this.favoritesRepository.findOneByOrFail({ id: favoriteId });
    const ability = this.abilityFactory.defineAbility(currentUser);
    if (!ability.can(Action.Update, favorite)) {
      throw new ForbiddenException('You are not allowed to update this favorite.');
    }

    return this.favoritesRepository.save(Object.assign(favorite, updateFavoriteDto));
  }

  async deleteFavorite(favoriteId: string, currentUser: User) {
    const favorite = await this.favoritesRepository.findOneByOrFail({ id: favoriteId });

    const ability = this.abilityFactory.defineAbility(currentUser);

    if (!ability.can(Action.Delete, favorite)) {
      throw new ForbiddenException('You are not allowed to delete this favorite.');
    }

    return this.favoritesRepository.remove(favorite);
  }
}
