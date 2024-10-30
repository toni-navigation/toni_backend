import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';

import { User, UserRole } from '@/users/entities/user.entity';

export default class DevelopmentSeeder extends Seeder {
  async run(dataSource: DataSource) {
    await DevelopmentSeeder.exampleSetup(dataSource);
  }

  private static async exampleSetup(dataSource: DataSource) {
    const usersRepository = dataSource.getRepository(User);
    try {
      await usersRepository.save(
        [
          {
            firstname: 'John',
            lastname: 'Doe',
            role: UserRole.ADMIN,
            email: 'a@example.com',
          },
          {
            firstname: 'Jane',
            lastname: 'Doe',
            role: UserRole.USER,
            email: 'b@example.com',
          },
          {
            firstname: 'Alice',
            lastname: 'Smith',
            role: UserRole.USER,
            email: 'c@example.com',
          },
        ].map((data) =>
          usersRepository.create({
            ...data,
            password: 'Test1234',
          }),
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }
}
