import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import { BannerItemDto } from '@/dto';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/auth/roles-auth.decorator';
import { RolesGuard } from '@/auth/roles.guard';

import { AdminBannerService } from './admin.banner.service';

@Controller('admin/banners')
export class AdminBannerController {
  constructor(private readonly bannerService: AdminBannerService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Get('list')
  async list(@Res() res) {
    const data = await this.bannerService.getAll();
    return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() payload: BannerItemDto, @Res() res) {
    const item = await this.bannerService.create(payload);
    return res.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Patch(':banner_id')
  async update(
    @Param('banner_id') banner_id: number,
    @Body() payload: Partial<BannerItemDto>,
    @Res() res,
  ) {
    const item = await this.bannerService.update(Number(banner_id), payload);
    return res.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Delete(':banner_id')
  async remove(@Param('banner_id') banner_id: number, @Res() res) {
    await this.bannerService.remove(Number(banner_id));
    return res.status(HttpStatus.OK).json({ ok: true });
  }
}

