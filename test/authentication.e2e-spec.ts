import { INestApplication } from '@nestjs/common';
import TestAgent from "supertest/lib/agent";
import {setupE2E} from "@/test/setup-e2e";
export type GetAgent = () => TestAgent;
describe('Authentication', () => {
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

  it('is unauthorized per default', async () =>
      await unauthenticatedAgent().get('/authentication').expect(401)
  );

  it('can login with valid credentials', async () =>
      await agent()
          .post('/authentication')
          .send({email: 'e2e-first@example.com', password: 'Test1234'})
          .expect(201)
  );

  it('cannot login with invalid credentials', async () =>
      await agent()
          .post('/authentication')
          .send({email: 'e2e-first@example.com', password: 'Test5678'})
          .expect(500)
  );

  it('can logout when user is logged in', async () => {
    await agent()
        .delete('/authentication')
        .expect(204);

  });

  it('cannot logout when user is not logged in', async () =>
      await unauthenticatedAgent()
          .delete('/authentication')
          .expect(401)
  );

  it('can get authentication details when user is logged in', async () =>
      await agent()
          .get('/authentication')
          .expect(200)
  );

  it('cannot get authentication details when user is not logged in', async () =>
      await unauthenticatedAgent()
          .get('/authentication')
          .expect(401)
  );

  it('is not fully authenticated when token is not set', async () => {
    await unauthenticatedAgent()
        .post('/authentication')
        .send({email: 'e2e-first@example.com', password: 'Test1234'});

    await unauthenticatedAgent()
        .get('/authentication')
        .expect(401);
  });

});
