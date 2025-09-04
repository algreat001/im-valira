import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto, ProductVariantDto } from '@/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/model/product.entity';
import { Category } from '@/model/category.entity';
import { ProductVariant } from '@/model/product.variant.entity';
import { FindOptionsRelations, In, Repository } from 'typeorm';
import { Tag } from '@/model/tag.entity';

@Injectable()
export class AdminProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(ProductVariant)
    private readonly variantsRepository: Repository<ProductVariant>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
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

  async getAll(): Promise<ProductDto[]> {
    const products = await this.getAllProducts({ categories: true, variants: true });
    if (!products) {
      throw new BadRequestException();
    }
    return products.map((product) => product.dto);
  }

  // Create product
  async create(payload: ProductDto): Promise<ProductDto> {
    const categories: Category[] = payload.categories?.length
      ? await this.categoriesRepository.find({ where: { category_id: In(payload.categories) } })
      : [];
    const tags: Tag[] = payload.tags?.length
      ? await this.tagsRepository.find({ where: { link: In(payload.tags) } })
      : [];
    const entity = Product.fromDto(payload, categories, tags);
    const saved = await this.productsRepository.save(entity);
    const withRelations = await this.getProduct(saved.product_id, { categories: true, variants: true });
    return withRelations.dto;
  }

  async update(product_id: number, payload: ProductDto): Promise<ProductDto> {
    const product = await this.getProduct(product_id, { categories: true, variants: true });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (payload.name !== undefined) {
      product.name = payload.name;
    }
    if (payload.meta !== undefined) {
      product.meta = payload.meta;
    }
    if (Array.isArray(payload.categories)) {
      product.categories = await this.categoriesRepository.find({ where: { category_id: In(payload.categories) } });
    }
    if (Array.isArray(payload.tags)) {
      product.tags = await this.tagsRepository.find({ where: { link: In(payload.tags) } });
    }
    const saved = await this.productsRepository.save(product);
    return saved.dto;
  }

  async remove(product_id: number): Promise<void> {
    const product = await this.getProduct(product_id);
    if (!product) {
      return;
    }
    await this.productsRepository.delete({ product_id });
  }

  async listVariants(product_id: number): Promise<ProductVariantDto[]> {
    const product = await this.getProduct(product_id, { variants: true });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return (product.variants || []).map((v) => v.dto);
  }

  async createVariant(product_id: number, payload: any): Promise<ProductVariantDto> {
    const product = await this.getProduct(product_id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const variant = ProductVariant.fromDto(payload as ProductVariantDto, product);
    const saved = await this.variantsRepository.save(variant);
    return saved.dto;
  }

  async updateVariant(product_id: number, variant_id: number, payload: any): Promise<ProductVariantDto> {
    const variant = await this.variantsRepository.findOne({
      where: { product_variant_id: variant_id },
      relations: { product: true },
    });
    if (!variant || !variant.product || variant.product.product_id !== product_id) {
      throw new NotFoundException('Variant not found');
    }
    if (payload.name !== undefined) {
      variant.name = payload.name;
    }
    if (payload.meta !== undefined) {
      variant.meta = payload.meta;
    }
    const saved = await this.variantsRepository.save(variant);
    return saved.dto;
  }

  async deleteVariant(product_id: number, variant_id: number): Promise<void> {
    const variant = await this.variantsRepository.findOne({
      where: { product_variant_id: variant_id },
      relations: { product: true },
    });
    if (!variant || !variant.product || variant.product.product_id !== product_id) {
      return;
    }
    await this.variantsRepository.delete({ product_variant_id: variant_id });
  }

  async addToCatalog(category_id: number, productId: number): Promise<ProductDto> {
    const catalog = await this.categoriesRepository.findOne({ where: { category_id } });
    const product = await this.getProduct(productId, { categories: true });
    if (!catalog || !product) {
      throw new BadRequestException();
    }
    product.categories.push(catalog);
    const updateProduct = await this.productsRepository.save(product);

    return updateProduct.dto;
  }


}
