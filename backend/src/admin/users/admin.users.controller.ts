import {
  Controller,
  Get,
  Res,
  Body,
  HttpStatus,
  Req,
  UseGuards,
  Patch, Post, Param, Delete,
} from '@nestjs/common';

import { UserDto } from '@/dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/auth/roles-auth.decorator';
import { RolesGuard } from '@/auth/roles.guard';

import { AdminUsersService } from './admin.users.service';

@Controller('api/v1/admin/users')
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Get('/profile')
  async profile(@Res() response, @Req() request) {
    const findUser = await this.adminUsersService.findOne(request.user);
    return response.status(HttpStatus.OK).json(findUser);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Patch('/profile')
  async profileUpdate(@Res() response, @Body() user: UserDto, @Req() request) {
    console.log(`[admin.users.profileUpdate] creator: ${request.user.email}, user: ${user.email}`);
    const findUser = await this.adminUsersService.update(user);
    return response.status(HttpStatus.OK).json(findUser);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Get('/list')
  async profiles(@Res() response) {
    const findUsers = await this.adminUsersService.findAll();
    return response.status(HttpStatus.OK).json(findUsers);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Post('/create')
  async createUser(@Res() response, @Req() request, @Body() user: Partial<UserDto>): Promise<UserDto> {
    console.log(`[admin.users.createUser] creator: ${request.user.email}, user: ${user.email}`);
    const createdUser = await this.adminUsersService.create(user);
    return response.status(HttpStatus.OK).json(createdUser);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Post('/:user_id/roles')
  async assignRole(@Param('user_id') user_id: number, @Res() response, @Req() request, @Body() roles) {
    console.log(`[admin.users.assignRole] user: ${request.user.email}, user_id: ${user_id}, roles: ${roles.role}`);
    const updatedUser = await this.adminUsersService.assignRole(user_id, roles.role);
    return response.status(HttpStatus.OK).json(updatedUser);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Delete('/:user_id/roles/:role')
  async removeRole(@Param('user_id') user_id: number, @Param('role') role: string, @Res() response, @Req() request) {
    console.log(`[admin.users.removeRole] user: ${request.user.email}, user_id: ${user_id}, role: ${role}`);
    const updatedUser = await this.adminUsersService.removeRole(user_id, role);
    return response.status(HttpStatus.OK).json(updatedUser);
  }


  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Delete('/:user_id')
  async remove(@Param('user_id') user_id: number, @Res() response, @Req() request) {
    console.log(`[admin.users.remove] user: ${request.user.email}, user_id: ${user_id}`);
    const updatedUser = await this.adminUsersService.remove(user_id);
    return response.status(HttpStatus.OK).json(updatedUser);
  }

  // export async function resetPassword(userId: number | string): Promise<void> {
  //   await apiFetch(`/admin/users/${encodeURIComponent(userId)}/password/reset`, { method: "POST" });
  // }

}
