import { INestApplication } from '@nestjs/common';
import TestAgent from "supertest/lib/agent";
import {setupE2E} from "@/test/setup-e2e";
export type GetAgent = () => TestAgent;

describe('Users', () => {
    let app: INestApplication;
    let agent: GetAgent;
    let unauthenticatedAgent: GetAgent;
    let adminAgent: GetAgent;
    let firstUser: any;
    let adminUser: any;

    beforeEach(async () => {
        ({app, agent, unauthenticatedAgent, adminAgent, firstUser, adminUser} = await setupE2E());
    });

    afterAll(async () => {
        await app.close();
    });


  it('should not be allowed to retrieve all users with role user', async () => {
    await agent()
        .get('/users')
        .expect(403);

  });

  it('should retrieve all users with role admin', async () => {
    await adminAgent()
        .get('/users')
        .expect(200);
  });


  it('should retrieve the user itself', async () => {
    await agent()
        .get(`/users/${firstUser.user.id}`)
        .expect(200);
  });

  it('should not be allowed to retrieve another user', async () => {
    await agent()
        .get(`/users/${adminUser.user.id}`)
        .expect(403);
  });

it('should create a new user', async () => {
    await unauthenticatedAgent()
        .post('/users')
        .send({ email: 'newUser@example.com', password: 'newUser1', firstname: 'New', lastname: 'User' },)
        .expect(201);
});

  it('should fail to create a new user, because password is too short', async () => {

    await unauthenticatedAgent()
        .post('/users')
        .send({ email: 'newUser2@example.com', password: 'new', firstname: 'New2', lastname: 'User2' },)
        .expect(400);
  });

  it('should fail to create a new user, because email is not in a valid form', async () => {
    await unauthenticatedAgent()
        .post('/users')
        .send({ email: 'newUser3@example', password: 'newUser3', firstname: 'New3', lastname: 'User3' },)
        .expect(400);
  });

  it('should fail to create a new user, because firstname is not set', async () => {
    await unauthenticatedAgent()
        .post('/users')
        .send({ email: 'newUser4@example', password: 'newUser4', firstname: '', lastname: 'User4' },)
        .expect(400);
  });

  it('should fail to create a new user, because lastname is not set', async () => {
    await unauthenticatedAgent()
        .post('/users')
        .send({ email: 'newUser5@example', password: 'newUser5', firstname: 'New5', lastname: '' },)
        .expect(400);
  });

  it('should update the user itself (firstname)', async () => {
    await agent()
        .patch(`/users/${firstUser.user.id}`)
        .send({ email: 'e2e-first@example.com', password: 'Test1234', firstname: 'updatedName', lastname: 'E2E' },)
        .expect(200);
  });

  it('should throw an error when email format is not correct when updating', async () => {
    await agent()
        .patch(`/users/${firstUser.user.id}`)
        .send({ email: 'e2e-first@example', password: 'Test1234', firstname: 'updatedName', lastname: 'E2E' },)
        .expect(400);
  });

  it('should not be allowed to update another user', async () => {
    await agent()
        .patch(`/users/${adminUser.user.id}`)
        .send({ email: 'e2e-admin@example.com', password: 'Test5678', firstname: 'updatedName', lastname: 'E2E' },)
        .expect(403);
  });

  it('should be able to update another user as an admin user (lastname)', async () => {
    await adminAgent()
        .patch(`/users/${firstUser.user.id}`)
        .send({ email: 'e2e-first@example.com', password: 'Test5678', firstname: 'updatedName', lastname: 'E2E Update' },)
        .expect(200);
  });

  // it('should be able to delete the user itself', async () => {
  //   await deleteAgentOne()
  //       .delete(`/users/${deleteUserOne.user.id}`)
  //       .expect(200);
  // });

  // it('should not be allowed to delete another user', async () => {
  //   await agent()
  //       .delete(`/users/${adminUser.user.id}`)
  //       .expect(401);
  // });

  // it('should be able to delete another user as an admin user', async () => {
  //     await adminAgent()
  //         .delete(`/users/${deleteUserTwo.user.id}`)
  //         .expect(200);
  // });

});


