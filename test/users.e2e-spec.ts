import {INestApplication} from '@nestjs/common';
import {User} from '@/users/entities/user.entity';
import {GetAgent, setupE2E} from "@/test/setup/setup-e2e";

describe('Users', () => {
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
        .get(`/users/${userOne.id}`)
        .expect(200);
  });

  it('should not be allowed to retrieve another user', async () => {
    await agent()
        .get(`/users/${userTwo.id}`)
        .expect(403);
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

  it('should update the user itself (firstname)', async () => {
    await agent()
        .patch(`/users/${userOne.id}`)
        .send({ email: 'e2e-first@example.com', password: 'Test1234', firstname: 'updatedName', lastname: 'E2E' },)
        .expect(200);
  });

  it('should throws an error when email format is not correct', async () => {
    await agent()
        .patch(`/users/${userOne.id}`)
        .send({ email: 'e2e-first@example', password: 'Test1234', firstname: 'updatedName', lastname: 'E2E' },)
        .expect(400);
  });

  it('should not be allowed to update another user', async () => {
    await agent()
        .patch(`/users/${userTwo.id}`)
        .send({ email: 'e2e-second@example.com', password: 'Test5678', firstname: 'updatedName', lastname: 'E2E' },)
        .expect(200);
  });

  it('should be able to delete the user itself', async () => {
    await agent()
        .delete(`/users/${userOne.id}`)
        .expect(200);
  });

  it('should not be allowed to delete another user', async () => {
    await agent()
        .delete(`/users/${userTwo.id}`)
        .expect(403);
  });


});


