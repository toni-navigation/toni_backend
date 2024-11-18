import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from '@node-rs/argon2';


import { AppModule } from '@/app.module';
import { User } from '@/users/entities/user.entity';

describe('Authentication', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Retrieve the user repository instance
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    await userRepository.delete({});
    const hashedPassword1 = await argon2.hash('Test1234');
    const hashedPassword2 = await argon2.hash('Test5678');

    // Add two users before each test
    await userRepository.save([
      { email: 'a@example.com', password: hashedPassword1, firstname: 'aFirstname', lastname: 'aLastname' },
      { email: 'b@example.com', password: hashedPassword2, firstname: 'bFirstname', lastname: 'bLastname' }
    ]);
  });


  afterEach(async () => {
    await app.close();
  });

  it('is unauthorized per default', async () =>
      await request(app.getHttpServer()).get('/authentication').expect(401)
  );

  it('can login with valid credentials', async () =>
      await request(app.getHttpServer())
          .post('/authentication')
          .send({email: 'a@example.com', password: 'Test1234'})
          .expect(201)
  );

  it('cannot login with invalid credentials', async () =>
      await request(app.getHttpServer())
          .post('/authentication')
          .send({email: 'a@example.com', password: 'Test5678'})
          .expect(401)
  );

  // it('can logout when user is logged in', async () => {
  //   await request(app.getHttpServer())
  //       .post('/authentication')
  //       .send({ email: 'a@example.com', password: 'Test1234' })
  //       .expect(201);
  //
  //   await request(app.getHttpServer())
  //       .delete('/authentication')
  //       .expect(204);
  //
  // });
  //
  // it('cannot logout when user is not logged in', async () =>
  //     await request(app.getHttpServer())
  //         .delete('/authentication')
  //         .expect(401)
  // );

});
