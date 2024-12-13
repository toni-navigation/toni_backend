import { INestApplication } from '@nestjs/common';
import TestAgent from "supertest/lib/agent";
import {getFavoriteIds, setupE2E} from "@/test/setup/setup-e2e";
import {favoritesData, userData} from "@/test/setup/user-data";
import {getUserIds} from "@/test/setup/setup-e2e";
export type GetAgent = () => TestAgent;

describe('Favorites', () => {
    let app: INestApplication;
    let agent: GetAgent;
    let getUserId: (key: keyof typeof userData) => Promise<string | null>;
    let getFavoriteId: (userId: string) => Promise<string[]>;
    let userId: string | null;
    let adminId: string | null;
    let userFavoriteIds: string[] = [];
    let adminFavoriteIds: string[] = [];

    beforeAll(async () => {
        ({ getUserId } = await getUserIds());
        userId = await getUserId('user');
        adminId = await getUserId('adminUser');
        ({ getFavoriteId } = await getFavoriteIds());
        if (userId) {
            userFavoriteIds = await getFavoriteId(userId);
        }
        if (adminId) {
            adminFavoriteIds = await getFavoriteId(adminId);
        }
    });

    afterAll(async () => {
        await app.close();
    });

    describe('User Tests', () => {

        beforeEach(async () => {
            ({app, agent,} = await setupE2E('user'));
        });

        it('should only get the own favorites', async () => {
            const response = await agent().get('/favorites');
            expect(response.body).toHaveLength(3);
        });

        it('should retrieve all favorites of itself', async () => {
            await agent().get('/favorites').expect(200);
        });

        it('should retrieve one favorite of its own favorites', async () => {
            await agent().get(`/favorites/${userFavoriteIds[0]}`).expect(200);
        });

        it('should not be allowed to retrieve one favorite of another user', async () => {
            await agent().get(`/favorites/${adminFavoriteIds[0]}`).expect(403);
        });

        it('should create a new favorite', async () => {
            await agent()
                .post('/favorites')
                .send({name: favoritesData.newFavorite.name, destinationType: favoritesData.newFavorite.destinationType, photonFeature: favoritesData.newFavorite.photonFeature}).expect(201);
        });

        it('should update a favorite', async () => {
            await agent()
                .patch(`/favorites/${userFavoriteIds[0]}`)
                .send({name: 'Update'}).expect(200);
        });

        it('should not be allowed to update a favorite of another user', async () => {
            await agent()
                .patch(`/favorites/${adminFavoriteIds[0]}`)
                .send({name: 'Update'}).expect(403);
        });

        it('should delete a favorite', async () => {
            await agent().delete(`/favorites/${userFavoriteIds[2]}`).expect(200);
        });

        it('should not be allowed to delete a favorite of another user', async () => {
            await agent().delete(`/favorites/${adminFavoriteIds[0]}`).expect(403);
        });
    });

    describe('Admin Tests', () => {

        beforeEach(async () => {
            ({app, agent,} = await setupE2E('admin'));
        });

        it('should get one favorite of another user as an admin', async () => {
            await agent().get(`/favorites/${userFavoriteIds[0]}`).expect(200);
        });

        // it('should be able to update a favorite of another user as an admin', async () => {
        //     await agent()
        //         .patch(`/favorites/${userFavoriteIds[1]}`)
        //         .send({name: 'UpdateAsAdmin'}).expect(200);
        // });


    });

    describe('Unauthenticated Tests', () => {

        beforeEach(async () => {
            ({app, agent,} = await setupE2E('unauthenticated'));
        });

        it('should not be able to get all favorites when not logged in', async () => {
            await agent().get('/favorites').expect(401);
        });

        it('should not be able to get one favorite when not logged in', async () => {
            await agent().get(`/favorites/${userFavoriteIds[0]}`).expect(401);
        });

        it('should not be able to create a new favorite when not logged in', async () => {
            await agent()
                .post('/favorites')
                .send({name: favoritesData.newFavorite.name, destinationType: favoritesData.newFavorite.destinationType, photonFeature: favoritesData.newFavorite.photonFeature}).expect(401);
        });

        it('should not be able to delete a favorite when not logged in', async () => {
            await agent().delete(`/favorites/${userFavoriteIds[1]}`).expect(401);
        });

        it('should not be able to update a favorite when not logged in', async () => {
            await agent()
                .patch(`/favorites/${userFavoriteIds[1]}`)
                .send({name: 'Update'}).expect(401);
        });

    });

});


