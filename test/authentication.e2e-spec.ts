import { INestApplication } from '@nestjs/common';
import {User, UserRole} from "@/users/entities/user.entity";
import {GetAgent, setupE2E} from "@/test/setup/global-setup";

describe('Authentication', async () => {
    let app: INestApplication;
    let agent: GetAgent;
    let loginAs: (role: UserRole) => Promise<User>;
    let users: User[];

    beforeAll(async () => {
        ({app, agent, users} = await setupE2E());
    });

    // it('is unauthorized per default', async () =>
    //     await agent().get('/authentication').expect(401)
    // );
    //
    it('can login with valid credentials', async () => {
        await loginAs(UserRole.USER);
        await agent.post('/authentication')
            .send({email: 'e2e-first@example.com', password: 'Test1234'})
            .expect(201)
    });

    ;
    //
    // it('cannot login with invalid credentials', async () =>
    //     await agent()
    //         .post('/authentication')
    //         .send({email: 'e2e-first@example.com', password: 'Test5678'})
    //         .expect(401)
    // );
    //
    // it('can logout when user is logged in', async () => {
    //   await agent()
    //       .delete('/authentication')
    //       .expect(204);
    //
    // });
    //
    // it('cannot logout when user is not logged in', async () =>
    //     await agentTwo()
    //         .delete('/authentication')
    //         .expect(401)
    // );

});
