import { INestApplication } from '@nestjs/common';
import TestAgent from "supertest/lib/agent";
import {setupE2E} from "@/test/setup/setup-e2e";
import {userData} from "@/test/setup/user-data";
import {getUserIds} from "@/test/setup/setup-e2e";
export type GetAgent = () => TestAgent;

describe('Users', () => {
    let app: INestApplication;
    let agent: GetAgent;
    let getUserId: (key: keyof typeof userData) => Promise<string | null>;
    let userId: string | null;
    let adminId: string | null;
    let deletableUserOneId: string | null;
    let deletableUserTwoId: string | null;

    beforeAll(async () => {
        ({ getUserId } = await getUserIds());
        userId = await getUserId('user');
        adminId = await getUserId('adminUser');
        deletableUserOneId = await getUserId('deletableUserOne');
        deletableUserTwoId = await getUserId('deletableUserTwo');

    });

    afterAll(async () => {
        await app.close();
    });

    describe('User Tests', () => {

        beforeEach(async () => {
            ({ app, agent,  } = await setupE2E('user'));
        });

        it('should not be allowed to retrieve all users with role user', async () => {
            await agent()
                .get('/users')
                .expect(403);
        });

        it('should retrieve the user itself', async () => {
            await agent()
                .get(`/users/${userId}`)
                .expect(200);
        });

        it('should not be allowed to retrieve another user', async () => {
            await agent()
                .get(`/users/${adminId}`)
                .expect(403);
        });

        it('should update the user itself (firstname)', async () => {
            await agent()
                .patch(`/users/${userId}`)
                .send({ email: 'e2e-user@example.com', password: 'Test1234', firstname: 'updatedName', lastname: 'E2E' },)
                .expect(200);
        });

        it('should throw an error when email format is not correct when updating', async () => {
            await agent()
                .patch(`/users/${userId}`)
                .send({ email: 'e2e-user@example', password: 'Test1234', firstname: 'updatedName', lastname: 'E2E' },)
                .expect(400);
        });

        it('should not be allowed to update another user', async () => {
            await agent()
                .patch(`/users/${adminId}`)
                .send({ email: 'e2e-admin@example.com', password: 'Test5678', firstname: 'updatedName', lastname: 'E2E' },)
                .expect(403);
        });

        it('should not be allowed to delete another user', async () => {
          await agent()
              .delete(`/users/${adminId}`)
              .expect(403);
        });

    });

    describe('Unauthenticated Tests', () => {

        beforeEach(async () => {
            ({app, agent} = await setupE2E('unauthenticated'));
        });

        it('should create a new user', async () => {
            await agent()
                .post('/users')
                .send({ email: 'newUser@example.com', password: 'newUser1', firstname: 'New', lastname: 'User' },)
                .expect(201);
        });

        it('should fail to create a new user, because password is too short', async () => {

            await agent()
                .post('/users')
                .send({ email: 'newUser2@example.com', password: 'new', firstname: 'New2', lastname: 'User2' },)
                .expect(400);
        });

        it('should fail to create a new user, because email is not in a valid form', async () => {
            await agent()
                .post('/users')
                .send({ email: 'newUser3@example', password: 'newUser3', firstname: 'New3', lastname: 'User3' },)
                .expect(400);
        });

        it('should fail to create a new user, because firstname is not set', async () => {
            await agent()
                .post('/users')
                .send({ email: 'newUser4@example', password: 'newUser4', firstname: '', lastname: 'User4' },)
                .expect(400);
        });

        it('should fail to create a new user, because lastname is not set', async () => {
            await agent()
                .post('/users')
                .send({ email: 'newUser5@example', password: 'newUser5', firstname: 'New5', lastname: '' },)
                .expect(400);
        });
    });

    describe('Admin Tests', () => {

        beforeEach(async () => {
            ({app, agent} = await setupE2E('admin'));
        });

        it('should retrieve all users with role admin', async () => {
            await agent()
                .get('/users')
                .expect(200);
        });

        it('should be able to update another user as an admin user (lastname)', async () => {
            await agent()
                .patch(`/users/${userId}`)
                .send({ email: 'e2e-user@example.com', password: 'Test5678', firstname: 'updatedName', lastname: 'E2E Update' },)
                .expect(200);
        });

        it('should be able to delete another user as an admin user', async () => {
            await agent()
                .delete(`/users/${deletableUserTwoId}`)
                .expect(204);
        });
    });

    describe('Deletable User Tests', () => {

        beforeEach(async () => {
            ({app, agent} = await setupE2E('deletable'));
        });

        it('should be able to delete the user itself', async () => {
          await agent()
              .delete(`/users/${deletableUserOneId}`)
              .expect(204);
        });
    });

});


