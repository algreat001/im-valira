import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '@/model/product.entity';
import { ProductVariant } from '@/model/product.variant.entity';
import { Category } from '@/model/category.entity';

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
  }

  getHello(): string {
    return 'Hello World!';
  }
}


