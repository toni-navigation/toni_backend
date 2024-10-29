import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Public } from '@/authentication/decorators/public.decorator';
import { RequestWithUser } from '@/types/RequestWithUser';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UserRole } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

// @ApiCookieAuth()
@ApiBearerAuth('access-token')
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
