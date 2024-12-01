import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AppModule } from '@/app.module';
import { User, UserRole } from '@/users/entities/user.entity';
import TestAgent from "supertest/lib/agent";

export type GetAgent = () => TestAgent;

export async function setupE2E(): Promise<{ app: INestApplication; agent: GetAgent; agentTwo: GetAgent; adminAgent: GetAgent; users: User[] }> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    const userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    const password1 = 'Test1234';
    const password2 = 'Test5678';
    const passwordAdmin = 'Admin1234';

    await userRepository.clear();

    const users = await userRepository.save([
        { email: 'e2e-first@example.com', password: password1, firstname: 'First', lastname: 'E2E' },
        { email: 'e2e-second@example.com', password: password2, firstname: 'Second', lastname: 'E2E' },
        { email: 'e2e-admin@example.com', password: passwordAdmin, firstname: 'Admin', lastname: 'E2E', role: UserRole.ADMIN }
    ].map(user => userRepository.create(user)));

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