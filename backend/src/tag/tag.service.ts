import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '@/model/tag.entity';
import { ProductDto, TagDto } from '@/dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async list(): Promise<TagDto[]> {
    const tags = await this.tagRepository.find({ order: { name: 'ASC' } });
    return tags.map(t => ({ name: t.name, icon: t.icon, link: t.link }));
  }

  async getProductsByTagName(tagName: string): Promise<ProductDto[]> {
    const tag = await this.tagRepository.findOne({
      where: { link: tagName },
      relations: [ 'products', 'products.categories', 'products.variants', 'products.tags' ],
    });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag.products ? tag.products.map(p => p.dto) : [];
  }
}
