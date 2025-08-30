import { Injectable } from '@nestjs/common';
import { BannerItemDto } from '@/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '@/model/banner.entity';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
  ) {}

  async findAll(): Promise<BannerItemDto[]> {
    const rows = await this.bannerRepo.find();
    return rows.map(b => b.dto);
  }
}
