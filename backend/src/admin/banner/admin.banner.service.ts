import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Banner } from '@/model/banner.entity';
import { BannerItemDto } from '@/dto';

@Injectable()
export class AdminBannerService {
  constructor(
    @InjectRepository(Banner) private readonly bannerRepo: Repository<Banner>,
  ) {}

  async getAll(): Promise<BannerItemDto[]> {
    const rows = await this.bannerRepo.find({ order: { banner_id: 'ASC' } });
    return rows.map(b => b.dto);
  }

  async create(payload: BannerItemDto): Promise<BannerItemDto> {
    const entity = Banner.fromDto(payload);
    const saved = await this.bannerRepo.save(entity);
    return saved.dto;
  }

  async update(id: number, payload: Partial<BannerItemDto>): Promise<BannerItemDto> {
    const entity = await this.bannerRepo.findOne({ where: { banner_id: id } });
    if (!entity) {
      throw new NotFoundException('Banner not found');
    }
    Banner.fromDto(payload, entity);
    const saved = await this.bannerRepo.save(entity);
    return saved.dto;
  }

  async remove(id: number): Promise<void> {
    const entity = await this.bannerRepo.findOne({ where: { banner_id: id } });
    if (!entity) {
      throw new NotFoundException('Banner not found');
    }
    await this.bannerRepo.remove(entity);
  }

}
