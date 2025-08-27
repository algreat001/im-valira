import {
  Controller,
  Get,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/auth/roles-auth.decorator';
import { RolesGuard } from '@/auth/roles.guard';

import { AdminDashboardService } from './admin.dashboard.service';

@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Get('/metrics')
  async main(@Res() response) {
    const dashboard = await this.adminDashboardService.getMainDashboard();
    return response.status(HttpStatus.OK).json(dashboard);
  }

}
