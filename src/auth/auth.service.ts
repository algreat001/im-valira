import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable
} from "@nestjs/common";
import { User } from "../model/user.entity";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { secret } from "../utils/constants";
import { Token, UsersService } from "../users/users.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../model/role.entity";
import { Repository } from "typeorm";
import { RolesService } from "../roles/roles.service";
import { UserDto } from "../dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userService: UsersService,
    private roleService: RolesService
  ) {}

  async signup(user: UserDto): Promise<UserDto> {
    const findUser = await this.userService.findUser(user);
    if (findUser) {
      throw new BadRequestException();
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const addUser = {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user.email,
      password: hash,
      roles: await this.roleService.getDefaultRoles()
    } as User;
    await this.usersRepository.save(addUser);
    return await this.userService.findOne(user);
  }

  async signin(user: UserDto, jwt: JwtService): Promise<Token> {
    const foundUser = await this.usersRepository.findOne({
      where: { email: user.email },
      relations: [ "roles" ]
    });
    if (!foundUser) {
      throw new HttpException(
        "Incorrect username or password",
        HttpStatus.UNAUTHORIZED
      );
    }
    const { password } = foundUser;
    const isPasswordMatched = await bcrypt.compare(user.password, password);
    if (!isPasswordMatched) {
      throw new HttpException(
        "Incorrect username or password",
        HttpStatus.UNAUTHORIZED
      );
    }
    const payload = { email: user.email };
    return { token: jwt.sign(payload, { secret }) };
  }
}
