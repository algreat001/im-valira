import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { RolesService } from "./roles.service";
import { Roles } from "../auth/roles-auth.decorator";
import { RolesGuard } from "../auth/roles.guard";
import { RoleDto } from "../dto";

@Controller("api/v1/role")
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post()
  @Roles("Admin")
  @UseGuards(RolesGuard)
  create(@Body() dto: RoleDto): Promise<RoleDto> {
    return this.roleService.creteRole(dto);
  }

  @Delete()
  @Roles("Admin")
  @UseGuards(RolesGuard)
  deleteRole(@Body() dto: RoleDto): Promise<RoleDto[]> {
    return this.roleService.deleteRole(dto);
  }

  @Post("/list")
  @Roles("Admin")
  @UseGuards(RolesGuard)
  getAllRoles(): Promise<RoleDto[]> {
    return this.roleService.getAllRoles();
  }

  @Get("/:role")
  getRole(@Param("role") role: string): Promise<RoleDto> {
    return this.roleService.getRole(role);
  }
}
