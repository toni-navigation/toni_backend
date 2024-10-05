import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';

import { User } from '@/users/entities/user.entity';

export default class DevelopmentSeeder extends Seeder {
  async run(dataSource: DataSource) {
    await DevelopmentSeeder.exampleSetup(dataSource);
  }

  private static async exampleSetup(dataSource: DataSource) {
    const usersRepository = dataSource.getRepository(User);

    await usersRepository.save(
      [
        {
          email: 'a@example.com',
        },
        {
          email: 'b@example.com',
        },
        {
          email: 'c@example.com',
        },
      ].map((data) =>
        usersRepository.create({
          ...data,
          password: 'Test1234',
        }),
      ),
    );
  }
}
