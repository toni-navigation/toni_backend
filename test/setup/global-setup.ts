import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import 'tsconfig-paths/register';
import { AppModule } from '@/app.module';
import { User } from '@/users/entities/user.entity';
import { favoritesData, userData } from './user-data';
import { Favorite } from '@/favorites/entities/favorite.entity';
import { convertPhotonFeatureDtoToEntity } from '@/functions/convertPhotonFeatureDtoToEntity';

async function globalSetup() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    const favoriteRepository = moduleFixture.get<Repository<Favorite>>(getRepositoryToken(Favorite));

    await favoriteRepository.delete({});
    await userRepository.delete({});

    const users = await userRepository.save(
        Object.values(userData).map(user => userRepository.create(user))
    );

    const user = users.find(u => u.email === userData.user.email);
    const admin = users.find(u => u.email === userData.adminUser.email);

    if (user && admin) {
        const photonFeatureDataHome = convertPhotonFeatureDtoToEntity(favoritesData.home.photonFeature);
        const photonFeatureDataDoctor = convertPhotonFeatureDtoToEntity(favoritesData.doctor.photonFeature);
        const photonFeatureDataShops = convertPhotonFeatureDtoToEntity(favoritesData.shops.photonFeature);
        const photonFeatureDataDeletableFavoriteOne = convertPhotonFeatureDtoToEntity(favoritesData.deletableFavoriteOne.photonFeature);
        const photonFeatureDataDeletableFavoriteTwo = convertPhotonFeatureDtoToEntity(favoritesData.deletableFavoriteTwo.photonFeature);

        const userFavorites = [
            favoriteRepository.create({
                ...favoritesData.home,
                user: user,
                photonFeature: photonFeatureDataHome,
            }),
            favoriteRepository.create({
                ...favoritesData.doctor,
                user: user,
                photonFeature: photonFeatureDataDoctor,
            }),
            favoriteRepository.create({
                ...favoritesData.deletableFavoriteOne,
                user: user,
                photonFeature: photonFeatureDataDeletableFavoriteOne,
            }),
            favoriteRepository.create({
                ...favoritesData.shops,
                user: admin,
                photonFeature: photonFeatureDataShops,
            }),
            favoriteRepository.create({
                ...favoritesData.deletableFavoriteTwo,
                user: admin,
                photonFeature: photonFeatureDataDeletableFavoriteTwo,
            }),
        ];

        await favoriteRepository.save(userFavorites);
    }
}

export default globalSetup;