import {INestApplication} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import * as request from 'supertest';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as argon2 from '@node-rs/argon2';


import {AppModule} from '@/app.module';
import {User, UserRole} from '@/users/entities/user.entity';

describe('Users', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let userC: User | null;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Retrieve the user repository instance
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Delete all users before adding new ones (clean slate for each test)

    await userRepository.delete({});
    const hashedPassword1 = await argon2.hash('test1234');
    const hashedPassword2 = await argon2.hash('test5678');
    const hashedPasswordAdmin = await argon2.hash('admin1234');

    await userRepository.save([
      { email: 'c@example.com', password: hashedPassword1, firstname: 'cFirstname', lastname: 'cLastname' },
      { email: 'd@example.com', password: hashedPassword2, firstname: 'dFirstname', lastname: 'dLastname' },
      { email: 'admin@example.com', password: hashedPasswordAdmin, firstname: 'adminFirstname', lastname: 'adminLastname', role: UserRole.ADMIN}
    ]);

    userC = await userRepository.findOneByOrFail({ email: 'c@example.com', password: hashedPassword1, firstname: 'cFirstname', lastname: 'cLastname' });
    console.log(userC);
  });

  afterEach(async () => {
    await app.close();
  });


  it('should not be allowed to retrieve all users with role user', async () => {
    await request(app.getHttpServer())
        .get('/users')
        .auth('c@example.com', 'test1234')
        //.set('Cookie', 'toni=hello')
        //.set('Authorization', '...')
        .expect(403);

  });

  it('should retrieve all users with role admin', async () => {
    await request(app.getHttpServer())
        .get('/users')
        .auth('admin@example.com', 'admin1234')
        .expect(200);
  });


  it('should retrieve the user itself', async () => {
    if (userC instanceof User) {
      await request(app.getHttpServer())
          .get(`/users/${userC.id}`)
          .auth('c@example.com', 'test1234')
          .expect(200);
    }
  });

    it('should not be allowed to retrieve another user', async () => {
      await request(app.getHttpServer())
          .post('/authentication')
          .send({ email: 'c@example.com', password: 'test1234' })

      // await request(app.getHttpServer())
      //     .get(`/users/${userD.id}`)
      //     .expect(401);
    });

  it('should create a new user', async () => {
    await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'newUser@example.com', password: 'newUser1', firstname: 'New', lastname: 'User' },)
        .expect(201);
  });

  it('should fail to create a new user, because password is too short', async () => {

    await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'newUser2@example.com', password: 'new', firstname: 'New2', lastname: 'User2' },)
        .expect(400);
  });

  it('should fail to create a new user, because email is not in a valid form', async () => {
    await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'newUser3@example', password: 'newUser3', firstname: 'New3', lastname: 'User3' },)
        .expect(400);
  });

  it('should fail to create a new user, because firstname is not set', async () => {
    await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'newUser4@example', password: 'newUser4', firstname: '', lastname: 'User4' },)
        .expect(400);
  });

  it('should fail to create a new user, because lastname is not set', async () => {
    const response = await request(app.getHttpServer())
        .post('/users')
        .send({ email: 'newUser5@example', password: 'newUser5', firstname: 'New5', lastname: '' },)
        .expect(400);
    console.log(response.body.message.map((error: any) => error.constraints));
  });

  it('should update the user itself (firstname)', async () => {

    const response = await request(app.getHttpServer())
        .post('/authentication')
        .send({ email: 'c@example.com', password: 'test1234' })
    const user = response.body;
    await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .send({ email: 'c@example.com', password: 'test1234', firstname: 'updatedName', lastname: 'cLastname' },)
        .expect(200);
  });

  it('should throws an error when email format is not correct', async () => {

    const response = await request(app.getHttpServer())
        .post('/authentication')
        .send({ email: 'c@example.com', password: 'test1234' })
    const user = response.body;

    await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .send({ email: 'c@example', password: 'test1234', firstname: 'updatedName', lastname: 'cLastname' },)
        .expect(200);
  });

  it('should not be allowed to update another user', async () => {

    const user = await request(app.getHttpServer())
        .post('/authentication')
        .send({ email: 'c@example.com', password: 'test1234' })

    // await request(app.getHttpServer())
    //     .patch(`/users/${user.id}`)
    //     .send({ email: 'c@example', password: 'test1234', firstname: 'updatedName', lastname: 'cLastname' },)
    //     .expect(403);
  });

  it('should be able to delete the user itself', async () => {

    const response = await request(app.getHttpServer())
        .post('/authentication')
        .send({ email: 'c@example.com', password: 'test1234' })
    const user = response.body;

    await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .expect(200);
  });

  it('should not be allowed to delete another user', async () => {

    const user = await request(app.getHttpServer())
        .post('/authentication')
        .send({ email: 'c@example.com', password: 'test1234' })


    // await request(app.getHttpServer())
    //     .delete(`/users/${user.id}`)
    //     .expect(403);
  });


});


