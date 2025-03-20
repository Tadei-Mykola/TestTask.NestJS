import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthorizationUserDto } from './dto/authorization-user.dto';
import { User } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
@ApiTags('Users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/getUser')
  getUser(@Request() req) {
    return req.user;
  }

  @Post()
  async create(@Body() userCreate: CreateUserDto) {
    if (!userCreate) {
      throw new HttpException('Invalid user data', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.create(userCreate);
    if (!user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    } else {
      const jwt = await this.authService.generateJwt(user);
      return jwt;
    }
  }

  @Post('/authorization')
  async authorization(@Body() authorizationUserDto: AuthorizationUserDto) {
    const { login, password } = authorizationUserDto;
    if (!login || !password) {
      throw new HttpException(
        'Invalid authorization data',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user: User = await this.userService.authorize(login, password);

    const jwt = await this.authService.generateJwt(user);
    return jwt;
  }
}
