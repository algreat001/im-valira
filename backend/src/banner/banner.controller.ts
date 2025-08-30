import { Controller, Get } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerItemDto } from '@/dto';

@Controller('banners')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Get()
  async getAll(): Promise<BannerItemDto[]> {
    return this.bannerService.findAll();
  }
}

