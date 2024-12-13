import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@/app.module';
import * as request from 'supertest';
import TestAgent from "supertest/lib/agent";
import {INestApplication} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "@/users/entities/user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {userData} from "@/test/setup/user-data";
export type GetAgent = () => TestAgent;
import { Favorite } from '@/favorites/entities/favorite.entity';


export async function setupE2E(role: 'user' | 'admin' | 'unauthenticated' | 'deletable' = 'user'): Promise<{
    app: INestApplication;
    agent: GetAgent;
}>  {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    await app.init();

    const agent = request.agent(app.getHttpServer());

    let currentUser = null;

    if (role !== 'unauthenticated') {
        let loginData;
        if (role === 'admin') {
            loginData = { email: userData.adminUser.email, password: userData.adminUser.password };
        } else if (role === 'deletable') {
            loginData = { email: userData.deletableUserOne.email, password: userData.deletableUserOne.password };
        } else {
            loginData = { email: userData.user.email, password: userData.user.password };
        }
        const response = await agent.post('/authentication').send(loginData);
        currentUser = response.body;
        agent.set('Authorization', `Bearer ${currentUser.accessToken}`);
    }

    return { app, agent: () => agent};
}

export async function getUserIds(): Promise<{
    getUserId: (key: keyof typeof userData) => Promise<string | null>;
}> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    const getUserId = async (
        key: keyof typeof userData,
    ): Promise<string | null> => {
        const email = userData[key]?.email;
        if (!email) return null;
        const user = await userRepository.findOne({ where: { email: email.toLowerCase() } });
        return user ? user.id : null;
    };

    return { getUserId };
}


export async function getFavoriteIds(): Promise<{
    getFavoriteId: (userId: string) => Promise<string[]>;
}> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const favoriteRepository = moduleFixture.get<Repository<Favorite>>(getRepositoryToken(Favorite));

    const getFavoriteId = async (userId: string): Promise<string[]> => {
        const favorites = await favoriteRepository.find({ where: { userId } });
        return favorites.map(favorite => favorite.id);
    };

    return { getFavoriteId };
}
