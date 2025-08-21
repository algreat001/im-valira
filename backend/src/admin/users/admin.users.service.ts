import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { RoleDto, UserDto } from '@/dto';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';
import { UsersService } from '@/users/users.service';
import { RolesService } from '@/roles/roles.service';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private userService: UsersService,
    private roleService: RolesService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    return (await this.usersRepository.find({ relations: [ 'roles' ] })).map(user => user.adminDto);
  }

  async update(user: UserDto): Promise<null | UserDto> {
    const findUser = await this.findUser(user);
    if (!findUser) {
      throw new BadRequestException();
    }
    findUser.firstName = user.firstName;
    findUser.lastName = user.lastName;
    findUser.middleName = user.middleName;
    findUser.name = user.name;
    findUser.phone = user.phone;
    findUser.postalCode = user.postalCode;
    findUser.deliveryCity = user.deliveryCity;
    findUser.deliveryAddress = user.deliveryAddress;
    const result = await this.usersRepository.save(findUser);
    return result.adminDto;
  }

  async create(user: Partial<UserDto>): Promise<UserDto> {
    if (!user.email || !user.password) {
      throw new BadRequestException();
    }
    const findUser = await this.findUser(user);
    if (findUser) {
      throw new BadRequestException();
    }
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(user.password, salt);
    const addUser = new User();
    addUser.firstName = user?.firstName || '';
    addUser.lastName = user?.lastName || '';
    addUser.middleName = user?.middleName || '';
    addUser.name = user?.name || '';
    addUser.phone = user?.phone || '';
    addUser.postalCode = user?.postalCode || '';
    addUser.deliveryCity = user?.deliveryCity || '';
    addUser.deliveryAddress = user?.deliveryAddress || '';
    addUser.email = user.email;
    addUser.password = hash;
    addUser.roles = await this.roleService.getDefaultRoles();

    const result = await this.usersRepository.save(addUser);
    return result.adminDto;
  }

  async updateRoles(user: UserDto, roles: RoleDto[]): Promise<UserDto> {
    const findUser = await this.findUser(user);
    if (!findUser) {
      throw new BadRequestException();
    }
    findUser.roles = await this.updateRoleList(roles);
    const result = await this.usersRepository.save(findUser);
    return result.adminDto;
  }

  async updatePassword(user: UserDto): Promise<UserDto> {
    const findUser = await this.findUser(user);
    if (!findUser) {
      throw new BadRequestException();
    }
    const salt = await bcrypt.genSalt();
    findUser.password = await bcrypt.hash(user.password, salt);
    const result = await this.usersRepository.save(findUser);
    return result.adminDto;
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
    return findUser.adminDto;
  }

  async remove(id: number): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new BadRequestException();
    }
    if (user.email === 'alexey.shkolnik@gmail.com') {
      throw new BadRequestException();
    }

    const result = await this.usersRepository.delete(id);
    return result.affected > 0;
  }

  async getOne(email: string): Promise<UserDto> {
    const user = await this.usersRepository.findOne({
      where: { email },
      relations: [ 'roles' ],
    });
    if (!user) {
      throw new BadRequestException();
    }
    return user.adminDto;
  }

  async findUser(user: UserDto): Promise<User> {
    if (!user || !user.email) {
      throw new HttpException(
        'Incorrect username or password',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return await this.usersRepository.findOne({
      where: { email: user.email },
      relations: [ 'roles' ],
    });
  }

  async assignRole(user_id: number, roleName: string): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ where: { user_id }, relations: { roles: true } });
    if (!user) {
      throw new BadRequestException();
    }
    const role = await this.rolesRepository.findOne({ where: { role: roleName } });
    if (!role) {
      throw new BadRequestException();
    }
    user.roles.push(role);
    const result = await this.usersRepository.save(user);
    return result.adminDto;
  }

  async removeRole(user_id: number, roleName: string): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ where: { user_id }, relations: { roles: true } });
    if (!user) {
      throw new BadRequestException();
    }
    if (user.email === 'alexey.shkolnik@gmail.com' && roleName === 'Admin') {
      throw new BadRequestException();
    }
    const role = await this.rolesRepository.findOne({ where: { role: roleName } });
    if (!role) {
      throw new BadRequestException();
    }
    user.roles = user.roles.filter(r => r.role !== roleName);
    const result = await this.usersRepository.save(user);
    return result.adminDto;
  }
}
