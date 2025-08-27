import {
  Controller,
  Get,
  Res,
  Body,
  Post,
  HttpStatus,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from '@/dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/auth/roles-auth.decorator';
import { RolesGuard } from '@/auth/roles.guard';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async Profile(@Res() response, @Req() request) {
    const findUser = await this.usersService.findOne(request.user);
    return response.status(HttpStatus.OK).json(findUser);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/profile')
  async ProfileUpdate(@Res() response, @Body() user: UserDto, @Req() request) {
    if (request.user.email !== user.email) {
      return response.status(HttpStatus.BAD_REQUEST).json({ message: 'Bad request' });
    }
    const findUser = await this.usersService.update(user);
    return response.status(HttpStatus.OK).json(findUser);
  }

  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Post('/profiles')
  async Profiles(@Res() response) {
    const findUsers = await this.usersService.findAll();
    return response.status(HttpStatus.OK).json(findUsers);
  }
}
