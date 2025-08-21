import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '@/model/role.entity';
import { Repository } from 'typeorm';
import { RoleDto } from '@/dto';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async creteRole(role: RoleDto): Promise<RoleDto> {
    const findRole = this.getRoleFromRepository(role.role);
    if (findRole) {
      throw new BadRequestException();
    }
    const saveRole = {
      role: role.role,
      description: role.description,
    } as Role;
    const newRole = await this.rolesRepository.save(saveRole);
    return newRole.dto;
  }

  async deleteRole(role: RoleDto): Promise<RoleDto[]> {
    const findRole = await this.getRoleFromRepository(role.role, true);
    if (!findRole || findRole.users.length > 0) {
      throw new BadRequestException();
    }
    await this.rolesRepository.delete(findRole.id);
    return this.getAllRoles();
  }

  async getAllRoles(): Promise<RoleDto[]> {
    return (await this.rolesRepository.find()).map(role => role.dto);
  }

  async getRole(role: string): Promise<RoleDto> {
    return (await this.getRoleFromRepository(role)).dto;
  }

  async getDefaultRoles(): Promise<Role[]> {
    return [ await this.getRoleFromRepository('User') ];
  }

  private async getRoleFromRepository(role: string, withUser = false): Promise<Role> {
    const option = withUser
      ? { where: { role }, include: [ 'users' ] }
      : { where: { role } };
    return await this.rolesRepository.findOne(option);
  }


}
