import { BadRequestException, Injectable } from "@nestjs/common";
import { CatalogDto, ProductDto } from "../dto";
import { Catalog } from "../model/catalog.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CatalogService {

  constructor(
    @InjectRepository(Catalog)
    private catalogRepository: Repository<Catalog>
  ) {}

  async getOneDto(id: string): Promise<CatalogDto> {
    const catalog = await this.getOne(id);
    return catalog.dto;
  }

  async getOne(id: string): Promise<Catalog> {
    const catalog = await this.catalogRepository.findOne({ where: { id } });
    if (!catalog) {
      throw new BadRequestException();
    }
    return catalog;
  }

  async newCatalogFromDto(source: CatalogDto): Promise<Catalog> {
    const dest = new Catalog();
    dest.name = source.name;
    dest.meta = source.meta;
    dest.parent = source.parent ? await this.getOne(source.parent) : null;
    return dest;
  }

}
