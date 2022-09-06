import {
  Controller,
  Get,
  Res,
  Body,
  Post,
  Put,
  HttpStatus,
  Req,
  UseGuards
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UserDto } from "../dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("api/v1/user")
export class UsersController {
  constructor(private readonly usersServerice: UsersService) {}

  @Get()
  async getHello(): Promise<string> {
    return "user api";
  }

  @UseGuards(JwtAuthGuard)
  @Post("/profile")
  async Profile(@Res() response, @Req() request) {
    const findUser = await this.usersServerice.findOne(request.user);
    return response.status(HttpStatus.OK).json(findUser);
  }

  @UseGuards(JwtAuthGuard)
  @Put("/profile")
  async ProfileUpdate(@Res() response, @Body() user: UserDto) {
    const findUser = await this.usersServerice.update(user);
    return response.status(HttpStatus.OK).json(findUser);
  }
}
