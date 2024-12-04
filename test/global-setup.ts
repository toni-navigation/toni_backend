import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import 'tsconfig-paths/register';
import { AppModule } from '@/app.module';
import { User, UserRole } from '@/users/entities/user.entity';

async function globalSetup() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    const userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    const password1 = 'Test1234';
    const passwordDelete = 'Delete1234';
    const passwordAdmin = 'Admin1234';

    // TODO findOne mit Email and delete if exists
    await userRepository.delete({});

    const users = await userRepository.save([
        { email: 'e2e-first@example.com', password: password1, firstname: 'First', lastname: 'E2E', role: UserRole.USER  },
        { email: 'e2e-deleteUserOne@example.com', password: passwordDelete, firstname: 'DeleteUserOne', lastname: 'E2E', role: UserRole.USER  },
        { email: 'e2e-deleteUserTwo@example.com', password: passwordDelete, firstname: 'DeleteUserTwo', lastname: 'E2E', role: UserRole.USER  },
        { email: 'e2e-admin@example.com', password: passwordAdmin, firstname: 'Admin', lastname: 'E2E', role: UserRole.ADMIN }
    ].map(user => userRepository.create(user)));
}
export default globalSetup;

