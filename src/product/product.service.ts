import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../model/product.entity";
import { ILike, Repository } from "typeorm";
import { ProductDto } from "../dto";
import { CatalogService } from "../catalog/catalog.service";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private catalogService: CatalogService
  ) {}


  async getList(catalogId: string): Promise<string[]> {
    const catalog = await this.catalogService.getOneWithProductIds(catalogId);
    const products = catalog.products;
    if (!products) {
      throw new BadRequestException();
    }
    return products.map(product => `${product.id}`);
  }

  async setList(catalogId, productIds): Promise<boolean> {
    const catalog = await this.catalogService.getOne(catalogId);
    const products: Product[] = [];
    for (const id of productIds) {
      const product = await this.productsRepository.findOne({ where: { id } });
      if (!product) {
        throw new BadRequestException();
      }
      products.push(product);
    }

    catalog.products = products;
    this.catalogService.saveEntity(catalog);
    return true;
  }

  async getSearchList(search: string): Promise<string[]> {
    const products = await this.productsRepository.find({ select: [ "id" ], where: { name: ILike(`%${search}%`) } });
    if (!products) {
      throw new BadRequestException();
    }
    return products.map(product => `${product.id}`);
  }

  async getOne(id: string): Promise<ProductDto> {
    const product = await this.productsRepository.findOne({ where: { id }, relations: [ "catalogs" ] });
    if (!product) {
      throw new BadRequestException();
    }
    return product.dto;
  }

  async updateProduct(dto: ProductDto): Promise<ProductDto> {
    let product = await this.productsRepository.findOne({ where: { id: dto.id } });
    if (!product) {
      product = await this.newProductFromDto(dto);
    } else {
      product = await this.updateProductFromDto(product, dto);
    }
    const resultProduct = await this.productsRepository.save(product);
    if (!resultProduct) {
      throw new BadRequestException();
    }
    return resultProduct.dto;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException();
    }
    const result = await this.productsRepository.delete({ id });
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return;
  }


  private async newProductFromDto(source: ProductDto): Promise<Product> {
    const dest = new Product();
    dest.name = source.name;
    dest.meta = source.meta;
    dest.catalogs = await Promise.all(source.catalogs.map(async (dto) => await this.catalogService.getOne(dto.id)));
    return dest;
  }

  private async updateProductFromDto(dest: Product, source: ProductDto): Promise<Product> {
    dest.name = source.name;
    dest.meta = source.meta;
    dest.catalogs = await Promise.all(source.catalogs.map(async (dto) => await this.catalogService.getOne(dto.id)));
    return dest;
  }


}
