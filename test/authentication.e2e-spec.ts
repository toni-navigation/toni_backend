import { INestApplication } from '@nestjs/common';
import TestAgent from "supertest/lib/agent";
import {setupE2E} from "@/test/setup/setup-e2e";
import {userData} from "@/test/setup/user-data";
export type GetAgent = () => TestAgent;

describe('Authentication', () => {
  let app: INestApplication;
  let agent: GetAgent;

  afterAll(async () => {
    await app.close();
  });

  describe('Unauthenticated Tests', () => {

    beforeEach(async () => {
      ({ app, agent } = await setupE2E('unauthenticated'));
    });

    afterEach(async () => {
      await app.close();
    });

    it('is unauthorized per default', async () => {
      await agent().get('/api/authentication').expect(401);
    });

    it('cannot logout when user is not logged in', async () => {
      await agent().delete('/api/authentication').expect(401);
    });
  });

  describe('User Tests', () => {

    beforeEach(async () => {
      ({ app, agent } = await setupE2E('user'));
    });

    afterEach(async () => {
      await app.close();
    });

    it('can login with valid credentials', async () => {
      await agent()
          .post('/api/authentication')
          .send({email: 'e2e-user@example.com', password: 'Test1234'})
          .expect(201)
    });

    it('can not find user when email does not exists', async () =>
        await agent()
            .post('/api/authentication')
            .send({email: 'e2e-notExistent@example.com', password: 'Test1234'})
            .expect(404)
    );

    it('cannot login with invalid password', async () =>
        await agent()
            .post('/api/authentication')
            .send({email: 'e2e-user@example.com', password: 'Test5678'})
            .expect(500)
    );

    it('can logout when user is logged in', async () => {
      await agent().delete('/api/authentication').expect(204);
    });

    it('can get authentication details when user is logged in', async () =>
        await agent().get('/api/authentication').expect(200)
    );
  });

});
