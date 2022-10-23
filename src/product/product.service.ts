import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../model/product.entity";
import { ILike, Repository } from "typeorm";
import { ProductDto } from "../dto";
import { CatalogService } from "../catalog/catalog.service";
import { ProductReviewMeta } from "../model/meta";
import { User } from "../model/user.entity";

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

  private async getProductForReviewEdit(id: string, user: User, review: ProductReviewMeta): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException();
    }
    if (user.email !== review.email && !user.isModerator()) {
      throw new BadRequestException();
    }
    return product;
  }

  private testBeforeEditReview(product: Product, review: ProductReviewMeta): void {
    if (!product.meta?.reviews) {
      throw new BadRequestException();
    }
    const findReview = product.meta.reviews
      .find(r => r.email === review.email && r.dataUpdate === review.dataUpdate);
    if (!findReview) {
      throw new BadRequestException();
    }
  }

  async addReview(id: string, user: User, review: ProductReviewMeta): Promise<null | ProductReviewMeta> {
    const product = await this.getProductForReviewEdit(id, user, review);

    review.dataUpdate = new Date();
    if (!product.meta?.reviews) {
      product.meta.reviews = [];
    }
    product.meta.reviews.push(review);

    const resultProduct = await this.productsRepository.save(product);
    const reviews = resultProduct.meta?.reviews;
    if (!reviews) {
      throw new BadRequestException();
    }
    return reviews.find(r => r.email === review.email && r.dataUpdate == review.dataUpdate);
  }

  async updateReview(id: string, user: User, review: ProductReviewMeta): Promise<null | ProductReviewMeta> {
    const product = await this.getProductForReviewEdit(id, user, review);
    this.testBeforeEditReview(product, review);

    const updateReviews = product.meta.reviews
      .filter(r => r.email !== review.email || r.dataUpdate !== review.dataUpdate);
    review.dataUpdate = new Date();
    updateReviews.push(review);
    product.meta.reviews = updateReviews;

    const resultProduct = await this.productsRepository.save(product);
    const reviews = resultProduct.meta?.reviews;
    if (!reviews) {
      throw new BadRequestException();
    }

    return reviews.find(r => r.email === review.email && r.dataUpdate == review.dataUpdate);
  }

  async deleteReview(id: string, user: User, review: ProductReviewMeta): Promise<void> {
    const product = await this.getProductForReviewEdit(id, user, review);
    this.testBeforeEditReview(product, review);

    product.meta.reviews = product.meta.reviews
      .filter(r => r.email !== review.email || r.dataUpdate !== review.dataUpdate);
    await this.productsRepository.save(product);
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
