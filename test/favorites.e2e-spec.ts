import {INestApplication} from '@nestjs/common';
import {User} from '@/users/entities/user.entity';
import {GetAgent, setupE2E} from "@/test/setup/setup-e2e";

describe('Favorites', () => {
  let app: INestApplication;
  let agent: GetAgent;
  let agentTwo: GetAgent;
  let adminAgent: GetAgent;
  let users: User[];
  let userOne: User;
  let userTwo: User;

  beforeEach(async () => {
    ({ app, agent, agentTwo, adminAgent, users } = await setupE2E());
    userOne = users[0];
    userTwo = users[1];
  });

  afterEach(async () => {
    await app.close();
  });


  it('should not be allowed to retrieve all favorites from another user', async () => {

  });

  it('should retrieve all favorites of itself', async () => {

  });


  it('should retrieve one favorite of its own favorites', async () => {

  });

  it('should not be allowed to retrieve one favorite of another user', async () => {

  });

  it('should create a new favorite', async () => {

  });

  it('should not be allowed to create a favorite for another user', async () => {

  });

  it('should update a favorite', async () => {

  });

  it('should not be allowed to update a favorite of another user', async () => {

  });

  it('should delete a favorite', async () => {

  });

  it('should not be allowed to delete a favorite of another user', async () => {

  });

  it('should get all favorites as an admin', async () => {

  });

});


