import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(this.usersRepository.create(createUserDto));
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneByOrFail({ id });

    return this.usersRepository.save(Object.assign(user, updateUserDto));
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneByOrFail({ id });

    return this.usersRepository.remove(user);
  }
}
