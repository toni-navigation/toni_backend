
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import { Repository } from 'typeorm';
import { User, UserRole } from '@/users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as request from 'supertest';
import {INestApplication} from "@nestjs/common";
import TestAgent from "supertest/lib/agent";

export type GetAgent = TestAgent;

export async function setupE2E(): Promise<{
    app: INestApplication;
    agent: GetAgent;
    loginAs: (role: UserRole) => Promise<User>;
    users: User[];
}> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    const userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    await userRepository.clear();

    const password1 = 'Test1234';
    const passwordAdmin = 'Admin1234';

    const users = await userRepository.save([
        { email: 'e2e-user@example.com', password: password1, firstname: 'User', lastname: 'E2E', role: UserRole.USER },
        { email: 'e2e-admin@example.com', password: passwordAdmin, firstname: 'Admin', lastname: 'E2E', role: UserRole.ADMIN }
    ].map(user => userRepository.create(user)));

    const agent = request.agent(app.getHttpServer());

    // Function to log in as a specific role
    const loginAs = async (role: UserRole): Promise<User> => {
        const credentials = role === UserRole.ADMIN
            ? { email: 'e2e-admin@example.com', password: 'Admin1234' }
            : { email: 'e2e-user@example.com', password: 'User1234' };

        await agent.post('/authentication').send(credentials);
        return role === UserRole.ADMIN ? users[0] : users[1];
    };

    return { app, agent, loginAs, users };
}





// import { Test, TestingModule } from '@nestjs/testing';
// import { AppModule } from '@/app.module';
// import { Repository } from 'typeorm';
// import { User, UserRole } from '@/users/entities/user.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import * as request from 'supertest';
//
// export default async function globalSetup() {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//         imports: [AppModule],
//     }).compile();
//
//     const app = moduleFixture.createNestApplication();
//     await app.init();
//
//     const userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
//
//     // Clear previous test users
//     await userRepository.clear();
//
//     const password1 = 'Test1234';
//     const passwordAdmin = 'Admin1234';
//     const users = await userRepository.save([
//         { email: 'e2e-first@example.com', password: password1, firstname: 'First', lastname: 'E2E', role: UserRole.USER },
//         { email: 'e2e-admin@example.com', password: passwordAdmin, firstname: 'Admin', lastname: 'E2E', role: UserRole.ADMIN }
//     ].map(user => userRepository.create(user)));
//
//     const userAgent = request.agent(app.getHttpServer());
//     const adminAgent = request.agent(app.getHttpServer());
//
//     await userAgent.post('/authentication').send({ email: 'e2e-first@example.com', password: 'User1234' });
//     await adminAgent.post('/authentication').send({ email: 'e2e-admin@example.com', password: 'Admin1234' });
//
//     global.__E2E_APP__ = app;
//     global.__E2E_USER_AGENT__ = userAgent;
//     global.__E2E_ADMIN_AGENT__ = adminAgent;
// }
