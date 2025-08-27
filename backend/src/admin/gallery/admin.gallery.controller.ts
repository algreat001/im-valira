import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Post,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { Roles } from '@/auth/roles-auth.decorator';
import { RolesGuard } from '@/auth/roles.guard';

import { AdminGalleryService } from './admin.gallery.service';

const GALLERY_DIR = path.join(process.cwd(), 'public', 'images', 'gallery');

@Controller('admin/gallery')
export class AdminGalleryController {
  constructor(private readonly galleryService: AdminGalleryService) {}

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Get('/list')
  async list(): Promise<string[]> {
    return this.galleryService.list();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Post('/images')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, GALLERY_DIR),
        filename: (_req, file, cb) => {
          const safeName = file.originalname.replace(/[^\w.\-]+/g, '_');
          const ts = Date.now();
          cb(null, `${ts}-${safeName}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File): Promise<{ filename: string; url: string }> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // Файл уже сохранен diskStorage. Сообщим клиенту итоговый путь.
    const filename = file.filename;
    const url = path.posix.join('/public/images/gallery', filename);
    await this.galleryService.upload(filename); // на случай доп. логики, можно no-op
    return { filename, url };
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Delete('/images')
  async remove(@Body('image') image: string): Promise<void> {
    if (!image) {
      throw new BadRequestException('image is required');
    }
    await this.galleryService.remove(image);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('Admin')
  @UseGuards(RolesGuard)
  @Patch('/images')
  async rename(@Body() payload: { oldName?: string; newName?: string }): Promise<void> {
    const { oldName, newName } = payload || {};
    if (!oldName || !newName) {
      throw new BadRequestException('oldName and newName are required');
    }
    await this.galleryService.rename(oldName, newName);
  }
}
