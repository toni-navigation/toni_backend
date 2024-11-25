import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from '@node-rs/argon2';

import { AppModule } from '@/app.module';
import { User, UserRole } from '@/users/entities/user.entity';

export type GetAgent = () => request.SuperTest<request.Test>;

export async function setupE2E(): Promise<{ app: INestApplication; agent: GetAgent; agentTwo: GetAgent; adminAgent: GetAgent; users: User[] }> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    const userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    const hashedPassword1 = await argon2.hash('Test1234');
    const hashedPassword2 = await argon2.hash('Test5678');
    const hashedPasswordAdmin = await argon2.hash('Admin1234');

    await userRepository.clear();

    const users = await userRepository.save([
        { email: 'e2e-first@example.com', password: hashedPassword1, firstname: 'First', lastname: 'E2E' },
        { email: 'e2e-second@example.com', password: hashedPassword2, firstname: 'Second', lastname: 'E2E' },
        { email: 'e2e-admin@example.com', password: hashedPasswordAdmin, firstname: 'Admin', lastname: 'E2E', role: UserRole.ADMIN }
    ]);

    const agent = request.agent(app.getHttpServer());
    await agent
        .post('/authentication')
        .send({ email: 'e2e-first@example.com', password: 'Test1234' });

    const agentTwo = request.agent(app.getHttpServer());

    const adminAgent = request.agent(app.getHttpServer());
    await adminAgent
        .post('/authentication')
        .send({ email: 'e2e-admin@example.com', password: 'Admin1234' });

    return { app, agent: () => agent, agentTwo: () => agentTwo, adminAgent: () => adminAgent , users};
}