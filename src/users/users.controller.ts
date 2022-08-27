import { Controller, Get, Res, Body, Post, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../model/user.entity';
import { JwtService } from '@nestjs/jwt';

@Controller('/api/v1/user')
export class UsersController {
  constructor(
    private readonly usersServerice: UsersService,
    private jwtService: JwtService,
  ) {}

  @Get()
  getHello(): string {
    return 'user api';
  }

  @Post('/signup')
  async Signup(@Res() response, @Body() user: User) {
    const newUSer = await this.usersServerice.signup(user);
    return response.status(HttpStatus.CREATED).json({
      newUSer,
    });
  }
  @Post('/signin')
  async SignIn(@Res() response, @Body() user: User) {
    const token = await this.usersServerice.signin(user, this.jwtService);
    return response.status(HttpStatus.OK).json(token);
  }
}
