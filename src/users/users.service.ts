import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    return this.usersRepository.save(this.usersRepository.create(createUserDto));
  }

  async findAllUsers(currentUser: User): Promise<User[]> {
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (ability.cannot(Action.Read, 'all')) {
      throw new ForbiddenException('You are not allowed to retrieve all users.');
    }

    return this.usersRepository.find();
  }

  async findUserById(id: string, currentUser: User): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({ id });
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (ability.cannot(Action.Read, user)) {
      throw new ForbiddenException('You are not allowed to retrieve this user.');
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto, currentUser: User) {
    const user = await this.findUserById(userId, currentUser);

    const ability = this.abilityFactory.defineAbility(currentUser);

    if (ability.cannot(Action.Update, user)) {
      throw new ForbiddenException('You are not allowed to update this user.');
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async deleteUser(userId: string, currentUser: User): Promise<void> {
    const user = await this.usersRepository.findOneOrFail({
      where: { id: userId },
      relations: ['favorites', 'favorites.photonFeature'],
    });
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (ability.cannot(Action.Delete, user)) {
      throw new ForbiddenException('You are not allowed to delete this user.');
    }

    await this.usersRepository.remove(user);
  }
}
