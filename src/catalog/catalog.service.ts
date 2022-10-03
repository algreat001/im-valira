import { BadRequestException, Injectable } from "@nestjs/common";
import { CatalogDto } from "../dto";
import { Catalog } from "../model/catalog.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";

@Injectable()
export class CatalogService {

  constructor(
    @InjectRepository(Catalog)
    private catalogRepository: Repository<Catalog>
  ) {}

  async getCatalogIdsFromParentId(parentCatalogId: string): Promise<string[]> {
    return (await this.getCatalogsFromParentId(parentCatalogId)).map(catalog => catalog.id);
  }

  async getCatalogsFromParentId(parentCatalogId: null | string): Promise<Catalog[]> {
    const where = { where: { parent: parentCatalogId ? { id: parentCatalogId } : IsNull() } };
    const catalogs = await this.catalogRepository.find(where);
    if (!catalogs) {
      throw new BadRequestException();
    }
    return catalogs;
  }

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

  async getOneWithProductIds(id: string): Promise<Catalog> {
    const catalog = await this.catalogRepository.findOne({
      where: { id },
      loadRelationIds: { relations: [ "products" ], disableMixedMap: true }
    });
    if (!catalog) {
      throw new BadRequestException();
    }
    return catalog;
  }

  async mergeDataFromDto(dest: Catalog, source: CatalogDto): Promise<void> {
    dest.name = source.name;
    dest.description = source.description;
    dest.meta = source.meta;
    dest.hasChildren = source.hasChildren;
    dest.parent = source.parent ? await this.getOne(source.parent) : null;
  }

  async newCatalogFromDto(source: CatalogDto): Promise<Catalog> {
    const dest = new Catalog();
    await this.mergeDataFromDto(dest, source);
    return dest;
  }

  async saveEntity(catalog: Catalog): Promise<void> {
    await this.catalogRepository.save(catalog);
  }

  async save(dto: CatalogDto): Promise<CatalogDto> {
    let catalog: Catalog;
    this.validate(dto);
    if (!dto.id) {
      catalog = await this.newCatalogFromDto(dto);
    } else {
      catalog = await this.getOne(dto.id);
      await this.mergeDataFromDto(catalog, dto);
    }
    await this.catalogRepository.save(catalog);
    return catalog.dto;
  }

  async delete(id: string): Promise<void> {
    const countChild = await this.catalogRepository.count({ where: { parent: { id } } });
    if (countChild > 0) {
      throw new BadRequestException();
    }
    const deleteEntity = await this.catalogRepository.findOne({ where: { id }, relations: [ "parent" ] });
    if (!deleteEntity) {
      throw new BadRequestException();
    }
    const parent = deleteEntity.parent;
    await this.catalogRepository.delete({ id });
    if (!parent) {
      return;
    }
    const countChildParent = await this.catalogRepository.count({ where: { parent: { id: parent.id } } });
    if (countChildParent > 0) {
      return;
    }
    parent.hasChildren = false;
    await this.catalogRepository.save(parent);
  }

  validate(dto: CatalogDto) {
    if (dto.name === null || dto.description === null) {
      throw new BadRequestException();
    }
  }

}
