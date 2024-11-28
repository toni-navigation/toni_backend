import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Public } from '@/authentication/decorators/public.decorator';
import { RequestWithUser } from '@/types/RequestWithUser';
import { CreateUserResponseDto } from '@/users/dto/create-user-response.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { ExceptionDto } from '@/users/dto/exception.dto';
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
  @ApiResponse({ status: 409, type: ExceptionDto })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiResponse({ status: 403, type: ExceptionDto })
  async findAllUsers(@Req() request: RequestWithUser) {
    const { user: currentUser } = request;

    return this.usersService.findAllUsers(currentUser);
  }

  @Get(':userId')
  @ApiResponse({ status: 403, description: 'Forbidden', type: ExceptionDto })
  @ApiResponse({ status: 404, description: 'Not Found', type: ExceptionDto })
  async findUserById(@Param('userId') userId: string, @Req() request: RequestWithUser) {
    const { user: currentUser } = request;

    return this.usersService.findUserById(userId, currentUser);
  }

  @Patch(':userId')
  @ApiResponse({ status: 403, description: 'Forbidden', type: ExceptionDto })
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
  @ApiResponse({ status: 403, description: 'Forbidden', type: ExceptionDto })
  async deleteUser(@Param('userId') userId: string, @Req() request: RequestWithUser) {
    const { user: currentUser } = request;

    return this.usersService.deleteUser(userId, currentUser);
  }
}
