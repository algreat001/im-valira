import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, ILike, Repository } from 'typeorm';

import { CategoryService } from '@/category/category.service';
import { TelegramService } from '@/telegram/telegram.service';

import { Product } from '@/model/product.entity';
import { User } from '@/model/user.entity';

import { ProductDto } from '@/dto';
import { ProductReviewMeta } from '@/model/meta';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly catalogService: CategoryService,
    private readonly telegramService: TelegramService,
  ) {}

  async getProduct(
    product_id: number,
    relations?: FindOptionsRelations<Product>,
  ): Promise<Product> {
    return this.productsRepository.findOne({ where: { product_id }, relations });
  }

  async getAllProducts(
    relations?: FindOptionsRelations<Product>,
  ): Promise<Product[]> {
    return this.productsRepository.find({ take: 1000, relations });
  }

  async getList(catalogId: number): Promise<string[]> {
    const catalog = await this.catalogService.getOneWithProductIds(catalogId);
    const products = catalog.products;
    if (!products) {
      throw new BadRequestException();
    }
    return products.map((product) => `${product.product_id}`);
  }

  async setList(catalogId: number, productIds): Promise<boolean> {
    const catalog = await this.catalogService.getOne(catalogId);
    const products: Product[] = [];
    for (const id of productIds) {
      const product = await this.getProduct(id); // this.productsRepository.findOne({ where: { id } });
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
    const products = await this.productsRepository.find({
      select: [ 'product_id' ],
      where: { name: ILike(`%${search}%`) },
    });
    if (!products) {
      throw new BadRequestException();
    }
    return products.map((product) => `${product.product_id}`);
  }

  async getAll(): Promise<ProductDto[]> {
    const products = await this.getAllProducts({ categories: true, variants: true });
    if (!products) {
      throw new BadRequestException();
    }
    return products.map((product) => product.dto);
  }

  async getOne(id: number): Promise<ProductDto> {
    const product = await this.getProduct(id, { categories: true, variants: true }); //await this.productsRepository.findOne({ where: { id }, relations: [ "catalogs" ] });
    if (!product) {
      throw new BadRequestException();
    }
    return product.dto;
  }

  private async getProductForReviewEdit(
    id: number,
    user: User,
    review: ProductReviewMeta,
  ): Promise<Product> {
    const product = await this.getProduct(id); //await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException();
    }
    if (user.email !== review.email && !user.isModerator()) {
      throw new BadRequestException();
    }
    return product;
  }

  private testBeforeEditReview(
    product: Product,
    review: ProductReviewMeta,
  ): void {
    if (!product.meta?.reviews) {
      throw new BadRequestException();
    }
    const findReview = product.meta.reviews.find(
      (r) => r.email === review.email && r.dataUpdate === review.dataUpdate,
    );
    if (!findReview) {
      throw new BadRequestException();
    }
  }

  async addReview(
    id: number,
    user: User,
    review: ProductReviewMeta,
  ): Promise<null | ProductReviewMeta> {
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
    const savedReview = reviews.find(
      (r) => r.email === review.email && r.dataUpdate == review.dataUpdate,
    );

    this.telegramService.sendMessage(
      'Новый обзор на товар:\n' +
      `${product.name} Id: ${product.product_id}\n` +
      `${savedReview.text}`,
    );

    return savedReview;
  }

  async updateReview(
    id: number,
    user: User,
    review: ProductReviewMeta,
  ): Promise<null | ProductReviewMeta> {
    const product = await this.getProductForReviewEdit(id, user, review);
    this.testBeforeEditReview(product, review);

    const updateReviews = product.meta.reviews.filter(
      (r) => r.email !== review.email || r.dataUpdate !== review.dataUpdate,
    );
    review.dataUpdate = new Date();
    updateReviews.push(review);
    product.meta.reviews = updateReviews;

    const resultProduct = await this.productsRepository.save(product);
    const reviews = resultProduct.meta?.reviews;
    if (!reviews) {
      throw new BadRequestException();
    }

    return reviews.find(
      (r) => r.email === review.email && r.dataUpdate == review.dataUpdate,
    );
  }

  async deleteReview(
    id: number,
    user: User,
    review: ProductReviewMeta,
  ): Promise<void> {
    const product = await this.getProductForReviewEdit(id, user, review);
    this.testBeforeEditReview(product, review);

    product.meta.reviews = product.meta.reviews.filter(
      (r) => r.email !== review.email || r.dataUpdate !== review.dataUpdate,
    );
    await this.productsRepository.save(product);
  }

}
