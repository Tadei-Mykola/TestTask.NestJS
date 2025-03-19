import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const isUser = await this.prisma.user.findFirst({
      where: { email: data.email },
    });

    if (isUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    if (!data.email) {
      throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
    }
    if (!data.password) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
    if (!data.name) {
      throw new HttpException('Invalid name', HttpStatus.BAD_REQUEST);
    }
    data.password = await bcrypt.hash(data.password + data.name, 10);
    return await this.prisma.user.create({
      data,
    });
  }

  async authorize(login: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { email: login } });
    if (user && (await bcrypt.compare(password + user.name, user.password))) {
      return user;
    }
    throw new HttpException('Invalid authorization data', HttpStatus.NOT_FOUND);
  }
}
