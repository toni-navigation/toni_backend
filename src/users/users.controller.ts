import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/authentication/decorators/public.decorator';
import { RequestWithUser } from '@/types/RequestWithUser';
import { CreateUserResponseDto } from '@/users/dto/create-user-response.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UsersService } from '@/users/users.service';

// @ApiCookieAuth()
@ApiBearerAuth('access-token')
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @ApiResponse({ status: 201, type: CreateUserResponseDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAllUsers(@Req() request: RequestWithUser) {
    const { user: currentUser } = request;

    return this.usersService.findAllUsers(currentUser);
  }

  @Get(':userId')
  async findUserById(@Param('userId') userId: string, @Req() request: RequestWithUser) {
    const { user: currentUser } = request;

    return this.usersService.findUserById(userId, currentUser);
  }

  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: RequestWithUser,
  ) {
    const { user: currentUser } = request;

    return this.usersService.updateUser(userId, updateUserDto, currentUser);
  }

  @Delete(':userId')
  @HttpCode(204)
  async deleteUser(@Param('userId') userId: string, @Req() request: RequestWithUser) {
    const { user: currentUser } = request;

    return this.usersService.deleteUser(userId, currentUser);
  }
}
