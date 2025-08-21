import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '@/model/product.entity';
import { ProductVariant } from '@/model/product.variant.entity';
import { Category } from '@/model/category.entity';
import { categories, products } from '@/mock/products';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly productsVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    //this.initMockData();
  }

  getHello(): string {
    return 'Hello World!';
  }

  async initMockData() {
    for (const category of categories) {
      await this.categoryRepository.save(Category.fromDto(category));
    }
    const categoriesFromDb = await this.categoryRepository.find({ take: 1000, skip: 0 });
    for (const product of products) {
      const dbProduct = await this.productsRepository.save(
        Product.fromDto(product, categoriesFromDb),
      );
      if (!!product.variants) {
        for (const variant of product.variants) {
          await this.productsVariantRepository.save(
            ProductVariant.fromDto(variant, dbProduct),
          );
        }
      }
    }

  }
}
