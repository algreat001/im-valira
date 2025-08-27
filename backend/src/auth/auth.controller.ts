import { Body, Controller, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UserDto } from '@/dto';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServerice: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  async Signup(@Res() response, @Body() user: UserDto) {
    const newUser = await this.authServerice.signup(user);
    console.log('Signup: ', user.email);
    return response.status(HttpStatus.CREATED).json(newUser);
  }

  @Post('/signin')
  async SignIn(@Res() response, @Body() user: UserDto) {
    const token = await this.authServerice.signin(user, this.jwtService);
    console.log('Login: ', user.email);
    return response.status(HttpStatus.OK).json(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async Logout(@Res() response, @Req() request) {
    console.log('Logout: ', request.user.email);
    return response.status(HttpStatus.OK).json({ message: 'Logout success' });
  }

}
