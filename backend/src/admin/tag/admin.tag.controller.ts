import { Controller, Get, Post, Patch, Delete, Param, Body, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { AdminTagService } from './admin.tag.service';
import { TagDto } from '@/dto';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/auth/roles-auth.decorator';
import { RolesGuard } from '@/auth/roles.guard';

@Controller('admin/tags')
export class AdminTagController {
  constructor(private readonly tagService: AdminTagService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Get('list')
  async list(@Res() res) {
    const data = await this.tagService.getAll();
    return res.status(HttpStatus.OK).json(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() payload: TagDto, @Res() res) {
    const item = await this.tagService.create(payload);
    return res.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Patch(':tag_id')
  async update(@Param('tag_id') tag_id: number, @Body() payload: Partial<TagDto>, @Res() res) {
    const item = await this.tagService.update(Number(tag_id), payload);
    return res.status(HttpStatus.OK).json(item);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Delete(':tag_id')
  async remove(@Param('tag_id') tag_id: number, @Res() res) {
    await this.tagService.remove(Number(tag_id));
    return res.status(HttpStatus.OK).json({ ok: true });
  }
}

