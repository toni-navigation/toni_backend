import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { render } from '@react-email/render';
import { Repository } from 'typeorm';

import { Action, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { EmailConfirmation } from '@/email/EmailConfiguration';
import { EmailService } from '@/email/email.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private abilityFactory: CaslAbilityFactory,
    private readonly emailService: EmailService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Die Email ist bereits vergeben.');
    }
    const user: User = await this.usersRepository.save(this.usersRepository.create(createUserDto));
    const payload = { user: { id: user.id, email: user.email.toLowerCase(), role: user.role }} ;

    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return {
      accessToken: this.jwtService.sign(payload, { secret }),
      user,
    };
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

  async deleteUser(userId: string, currentUser: User) {
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

  async validateUser(email: string, password: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOneOrFail({
      where: { email: email.toLowerCase() },
    });

    if (await user.comparePassword(password)) {
      return user;
    }

    throw new Error('AuthenticationService password mismatch.');
  }
}
