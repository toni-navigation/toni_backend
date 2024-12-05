import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import * as request from 'supertest';
import TestAgent from "supertest/lib/agent";
import {INestApplication} from "@nestjs/common";
export type GetAgent = () => TestAgent;

export async function setupE2E(): Promise<{
    app: INestApplication;
    agent: GetAgent;
    unauthenticatedAgent: GetAgent;
    adminAgent: GetAgent;
    firstUser: any;
    adminUser: any;
}>  {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    const agent = request.agent(app.getHttpServer());
    const responseAgent = await agent
        .post('/authentication')
        .send({ email: 'e2e-first@example.com', password: 'Test1234' });
    const firstUser = responseAgent.body;
    agent.set('Authorization', `Bearer ${firstUser.accessToken}`);

    const unaunauthenticatedAgent = request.agent(app.getHttpServer());


    const adminAgent = request.agent(app.getHttpServer());
    const responseAdminAgent = await adminAgent
        .post('/authentication')
        .send({ email: 'e2e-admin@example.com', password: 'Admin1234' });
    const adminUser = responseAdminAgent.body;
    adminAgent.set('Authorization', `Bearer ${adminUser.accessToken}`);


    return { app,
        agent: () => agent,
        unauthenticatedAgent: () => unaunauthenticatedAgent,
        adminAgent: () => adminAgent,
        firstUser, adminUser};

}
