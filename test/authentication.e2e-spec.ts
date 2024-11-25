import { INestApplication } from '@nestjs/common';
import {GetAgent, setupE2E} from "@/test/setup/setup-e2e";
import {User} from "@/users/entities/user.entity";

describe('Authentication', () => {
  let app: INestApplication;
  let agent: GetAgent;
  let agentTwo: GetAgent;
  let adminAgent: GetAgent;
  let users: User[];

  beforeAll(async () => {
    ({ app, agent, agentTwo, adminAgent, users } = await setupE2E());
  });

  afterEach(async () => {
    await app.close();
  });

  it('is unauthorized per default', async () =>
      await agent().get('/authentication').expect(401)
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
          .expect(401)
  );

  it('can logout when user is logged in', async () => {
    await agent()
        .delete('/authentication')
        .expect(204);

  });

  it('cannot logout when user is not logged in', async () =>
      await agentTwo()
          .delete('/authentication')
          .expect(401)
  );

});
