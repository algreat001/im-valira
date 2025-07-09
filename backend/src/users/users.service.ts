import { BadRequestException, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../model/user.entity";
import { RoleDto, UserDto } from "../dto";
import * as bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { Role } from "../model/role.entity";

export interface Token {
  token: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>
  ) {}

  async findAll(): Promise<UserDto[]> {
    return (await this.usersRepository.find({ relations: [ "roles" ] })).map(user => user.dto);
  }

  async update(user: UserDto): Promise<null | UserDto> {
    const findUser = await this.findUser(user);
    if (!findUser) {
      throw new BadRequestException();
    }
    findUser.firstName = user.firstName;
    findUser.lastName = user.lastName;
    findUser.phone = user.phone;
    findUser.address = user.address;
    if (user.password) {
      const salt = await bcrypt.genSalt();
      findUser.password = await bcrypt.hash(user.password, salt);
    }
    findUser.roles = await this.updateRoleList(user.roles);
    return await this.usersRepository.save(findUser);
  }

  async updateRoleList(roles: RoleDto[]): Promise<Role[]> {
    const result: Role[] = [];
    for (const roleDto of roles) {
      const role = await this.rolesRepository.findOne({ where: { role: roleDto.role } });
      if (!role) {
        throw new BadRequestException();
      }
      result.push(role);
    }
    return result;
  }


  async findOne(user: UserDto): Promise<UserDto> {
    const findUser = await this.findUser(user);
    if (!findUser) {
      throw new BadRequestException();
    }
    return findUser.dto;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async getOne(email: string): Promise<UserDto> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: [ "roles" ]
    });
    if (!user) {
      throw new BadRequestException();
    }
    return user.dto;
  }

  async findUser(user: UserDto): Promise<User> {
    if (!user || !user.email) {
      throw new HttpException(
        "Incorrect username or password",
        HttpStatus.UNAUTHORIZED
      );
    }
    return await this.usersRepository.findOne({
      where: { email: user.email },
      relations: [ "roles" ]
    });
  }
}
