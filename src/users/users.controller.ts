import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

import { Public } from '@/authentication/decorators/public.decorator';
import { Action, CaslAbilityFactory } from '@/casl/casl-ability.factory/casl-ability.factory';
import { RequestWithUser } from '@/types/RequestWithUser';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { User, UserRole } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

@ApiCookieAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  // Get all users (admin only)
  @Get()
  async findAllUsers(@Req() request: RequestWithUser) {
    const currentUser = request.user;

    return this.usersService.findAllUsers(currentUser);
  }

  @Get(':userId')
  async findUserById(@Param('userId') userId: string) {
    return this.usersService.findUserById(userId);
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto, @Req() req: RequestWithUser) {
    const currentUser = req.user;

    return this.usersService.updateUser(userId, updateUserDto, currentUser);
  }

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string, @Req() req: RequestWithUser) {
    const currentUser = req.user;

    return this.usersService.deleteUser(userId, currentUser);
  }

  // Change user role (admin only)
  @Put(':userId/role')
  async changeUserRole(@Param('userId') userId: string, @Body('role') newRole: UserRole, @Req() req: RequestWithUser) {
    const currentUser = req.user;

    return this.usersService.changeUserRole(userId, newRole, currentUser);
  }
}
