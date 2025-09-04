import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '@/model/tag.entity';
import { TagDto } from '@/dto';

@Injectable()
export class AdminTagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
  ) {}

  async getAll(): Promise<TagDto[]> {
    const rows = await this.tagRepo.find({
      order: { tag_id: 'ASC' },
      relations: [ 'products', 'products.categories', 'products.variants', 'products.tags' ],
    });
    return rows.map(t => t.dto);
  }

  async create(payload: TagDto): Promise<TagDto> {
    if (!payload.name) {
      throw new ConflictException('Name is required');
    }
    const exists = await this.tagRepo.findOne({ where: { name: payload.name } });
    if (exists) {
      throw new ConflictException('Tag with this name already exists');
    }
    const entity = Tag.fromDto(payload);
    const saved = await this.tagRepo.save(entity);
    return saved.dto;
  }

  async update(id: number, payload: Partial<TagDto>): Promise<TagDto> {
    const entity = await this.tagRepo.findOne({ where: { tag_id: id } });
    if (!entity) {
      throw new NotFoundException('Tag not found');
    }
    if (payload.name && payload.name !== entity.name) {
      const nameExist = await this.tagRepo.findOne({ where: { name: payload.name } });
      if (nameExist && nameExist.tag_id !== entity.tag_id) {
        throw new ConflictException('Another tag with this name already exists');
      }
      entity.name = payload.name;
    }
    entity.link = payload.link;
    entity.icon = payload.icon;
    const saved = await this.tagRepo.save(entity);
    return saved.dto;
  }

  async remove(id: number): Promise<void> {
    const entity = await this.tagRepo.findOne({ where: { tag_id: id } });
    if (!entity) {
      throw new NotFoundException('Tag not found');
    }
    await this.tagRepo.remove(entity);
  }
}

