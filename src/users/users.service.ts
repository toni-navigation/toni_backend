import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Action, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { User, UserRole } from '@/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private abilityFactory: CaslAbilityFactory,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    return this.usersRepository.save(this.usersRepository.create(createUserDto));
  }

  // Get all users (only admins can retrieve all users)
  async findAllUsers(currentUser: User): Promise<User[]> {
    const ability = this.abilityFactory.defineAbility(currentUser);

    if (!ability.can(Action.Read, 'all')) {
      throw new ForbiddenException('You are not allowed to retrieve all users.');
    }

    return this.usersRepository.find();
  }

  async findUserById(id: string) {
    const user = await this.usersRepository.findOneByOrFail({ id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Find a user by email
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto, currentUser: User) {
    const user = await this.findUserById(userId);

    const ability = this.abilityFactory.defineAbility(currentUser);

    if (!ability.can(Action.Update, user)) {
      throw new ForbiddenException('You are not allowed to update this user.');
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  // Delete a user (only admins can delete users)
  async deleteUser(userId: string, currentUser: User): Promise<void> {
    const user = await this.findUserById(userId);

    const ability = this.abilityFactory.defineAbility(currentUser);

    if (!ability.can(Action.Delete, user)) {
      throw new ForbiddenException('You are not allowed to delete this user.');
    }

    await this.usersRepository.remove(user);
  }

  // Change user role (only admins can change roles)
  async changeUserRole(userId: string, newRole: UserRole, currentUser: User): Promise<User> {
    const user = await this.findUserById(userId);

    const ability = this.abilityFactory.defineAbility(currentUser);

    if (!ability.can(Action.Update, user)) {
      throw new ForbiddenException("You are not allowed to update this user's role.");
    }

    user.role = newRole;

    return this.usersRepository.save(user);
  }
}
