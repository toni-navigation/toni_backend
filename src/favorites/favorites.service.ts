import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Action, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { CreateFavoriteDto } from '@/favorites/dto/create-favorite.dto';
import { UpdateFavoriteDto } from '@/favorites/dto/update-favorite.dto';
import { Favorite } from '@/favorites/entities/favorite.entity';
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

    if (!ability.can(Action.Create, Favorite)) {
      throw new ForbiddenException('You are not allowed to create a favorite.');
    }
    const photonFeatureData = convertPhotonFeatureDtoToEntity(createFavoriteDto.photonFeature);
    const photonFeature = this.photonFeatureRepository.create(photonFeatureData);
    const favorite = this.favoritesRepository.create({
      ...createFavoriteDto,
      user: currentUser,
      photonFeature,
    });
    const savedFavorite = this.favoritesRepository.save(favorite);

    return savedFavorite;
    //
    // const queryRunner = this.dataSource.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();
    //
    // try {
    //   const favorite = queryRunner.manager.create(Favorite, {
    //     ...rest,
    //     user: currentUser,
    //   });
    //
    //   const savedFavorite = await queryRunner.manager.save(favorite);
    //
    //   const photonFeatureEntity = queryRunner.manager.create(PhotonFeature, {
    //     ...convertPhotonFeatureDtoToEntity(photonFeature),
    //     favorite: savedFavorite, // Set the saved favorite
    //   });
    //
    //   await queryRunner.manager.save(photonFeatureEntity);
    //   await queryRunner.commitTransaction();
    //
    //   return convertEntityToPhotonFeatureDto(photonFeatureEntity);
    // } catch (error) {
    //   await queryRunner.rollbackTransaction();
    //   throw error; // Re-throw the error for further handling
    // } finally {
    //   await queryRunner.release();
    // }
  }

  async findAllFavorites(currentUser: User) {
    // const ability = this.abilityFactory.defineAbility(currentUser);
    //
    // if (!ability.can(Action.Read, Favorite)) {
    //   throw new ForbiddenException('You are not allowed to read favorites.');
    // }
    //
    // const result = await this.photonFeatureRepository.find({
    //   where: { favorite: { userId: currentUser.id } },
    //   relations: ['favorite'],
    // });
    //
    // return result.map((photonFeature) => convertEntityToPhotonFeatureDto(photonFeature));
  }

  async findFavoriteById(favoriteId: string, currentUser: User) {
    // const photonFeature = await this.photonFeatureRepository.findOneOrFail({
    //   where: { favoriteId },
    //   relations: ['favorite'],
    // });
    //
    // const ability = this.abilityFactory.defineAbility(currentUser);
    // if (!ability.can(Action.Read, photonFeature.favorite)) {
    //   throw new ForbiddenException('You are not allowed to read this favorite.');
    // }
    //
    // return convertEntityToPhotonFeatureDto(photonFeature);
  }

  async updateFavorite(favoriteId: string, updateFavoriteDto: UpdateFavoriteDto, currentUser: User) {
    // const photonFeature = await this.photonFeatureRepository.findOneOrFail({
    //   where: { favoriteId },
    //   relations: ['favorite'],
    // });
    //
    // const { favorite } = photonFeature;
    //
    // const ability = this.abilityFactory.defineAbility(currentUser);
    // if (!ability.can(Action.Update, favorite)) {
    //   throw new ForbiddenException('You are not allowed to update this favorite.');
    // }
    //
    // if (updateFavoriteDto.photonFeature) {
    //   Object.assign(photonFeature, convertPhotonFeatureDtoToEntity(updateFavoriteDto.photonFeature));
    // }
    // Object.assign(favorite, updateFavoriteDto);
    //
    // return this.favoritesRepository.save(favorite);
  }

  async deleteFavorite(favoriteId: string, currentUser: User) {
    // const photonFeature = await this.photonFeatureRepository.findOneOrFail({
    //   where: { favoriteId },
    //   relations: ['favorite'],
    // });
    //
    // const ability = this.abilityFactory.defineAbility(currentUser);
    //
    // if (!ability.can(Action.Delete, photonFeature.favorite)) {
    //   throw new ForbiddenException('You are not allowed to delete this favorite.');
    // }
    //
    // return this.favoritesRepository.remove(photonFeature.favorite);
  }
}
