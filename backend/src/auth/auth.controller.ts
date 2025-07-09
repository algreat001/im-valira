import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { UserDto } from "../dto";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";

@Controller("api/v1/auth")
export class AuthController {
  constructor(
    private readonly authServerice: AuthService,
    private jwtService: JwtService
  ) {}

  @Post("/signup")
  async Signup(@Res() response, @Body() user: UserDto) {
    const newUser = await this.authServerice.signup(user);
    return response.status(HttpStatus.CREATED).json(newUser);
  }

  @Post("/signin")
  async SignIn(@Res() response, @Body() user: UserDto) {
    const token = await this.authServerice.signin(user, this.jwtService);
    return response.status(HttpStatus.OK).json(token);
  }
}
