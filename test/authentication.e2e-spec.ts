import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '@/app.module';

describe('Authentication', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('is unauthorized per default', () => request(app.getHttpServer()).get('/authentication').expect(401));

  it('can login with valid credentials', () =>
    request(app.getHttpServer())
      .post('/authentication')
      .send({ email: 'a@example.com', password: 'Test1234' })
      .expect(201));
});