import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../model/product.entity';
import { FindOptionsRelations, ILike, Repository } from 'typeorm';
import { ProductDto } from '../dto';
import { CatalogService } from '../catalog/catalog.service';
import { TelegramService } from '../telegram/telegram.service';
import { CharacteristicMeta, ProductReviewMeta } from '../model/meta';
import { User } from '../model/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly catalogService: CatalogService,
    private readonly telegramService: TelegramService,
  ) {}

  async getProduct(
    id: string,
    relations?: FindOptionsRelations<Product>,
  ): Promise<Product> {
    return this.productsRepository.findOne({ where: { id }, relations });
  }

  async getList(catalogId: string): Promise<string[]> {
    const catalog = await this.catalogService.getOneWithProductIds(catalogId);
    const products = catalog.products;
    if (!products) {
      throw new BadRequestException();
    }
    return products.map((product) => `${product.id}`);
  }

  async setList(catalogId, productIds): Promise<boolean> {
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

  async addToCatalog(catalogId, productId): Promise<ProductDto> {
    const catalog = await this.catalogService.getOne(catalogId);
    const product = await this.getProduct(productId, { catalogs: true }); // this.productsRepository.findOne({ where: { id: productId }, relations: [ "catalogs" ] });
    if (!catalog || !product) {
      throw new BadRequestException();
    }
    product.catalogs.push(catalog);
    const updateProduct = await this.productsRepository.save(product);

    return updateProduct.dto;
  }

  async getSearchList(search: string): Promise<string[]> {
    const products = await this.productsRepository.find({
      select: ['id'],
      where: { name: ILike(`%${search}%`) },
    });
    if (!products) {
      throw new BadRequestException();
    }
    return products.map((product) => `${product.id}`);
  }

  async getOne(id: string): Promise<ProductDto> {
    const product = await this.getProduct(id, { catalogs: true }); //await this.productsRepository.findOne({ where: { id }, relations: [ "catalogs" ] });
    if (!product) {
      throw new BadRequestException();
    }
    return product.dto;
  }

  async updateProduct(dto: ProductDto): Promise<ProductDto> {
    let product: Product;
    if (!dto.id) {
      product = await this.newProductFromDto(dto);
    } else {
      product = await this.getProduct(dto.id); //await this.productsRepository.findOne({ where: { id: dto.id } });
      if (!product) {
        throw new BadRequestException();
      }
      product = await this.updateProductFromDto(product, dto);
    }
    const resultProduct = await this.productsRepository.save(product);
    if (!resultProduct) {
      throw new BadRequestException();
    }
    return resultProduct.dto;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.getProduct(id); //await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new BadRequestException();
    }
    const result = await this.productsRepository.delete({ id });
    if (result.affected === 0) {
      throw new BadRequestException();
    }
    return;
  }

  private async getProductForReviewEdit(
    id: string,
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
    id: string,
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
        `${product.name} Id: ${product.id}\n` +
        `${savedReview.text}`,
    );

    return savedReview;
  }

  async updateReview(
    id: string,
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
    id: string,
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

  private cbFindCharacteristic(
    characteristic: CharacteristicMeta,
  ): (characteristic: CharacteristicMeta) => boolean {
    return (ch) =>
      ch.name === characteristic.name &&
      ch.value === characteristic.value &&
      ch.unitOfMeasurement === characteristic.unitOfMeasurement;
  }

  private cbFilterCharacteristic(
    characteristic: CharacteristicMeta,
  ): (characteristic: CharacteristicMeta) => boolean {
    return (ch) => ch.name !== characteristic.name;
  }

  async addCharacteristic(
    id: string,
    characteristic: CharacteristicMeta,
  ): Promise<null | CharacteristicMeta> {
    const product = await this.getProduct(id);

    if (!!product.meta.characteristics) {
      product.meta.characteristics.push(characteristic);
    } else {
      product.meta.characteristics = [characteristic];
    }
    const resultProduct = await this.productsRepository.save(product);
    const characteristics = resultProduct.meta?.characteristics;
    if (!characteristics) {
      throw new BadRequestException();
    }
    return characteristics.find(this.cbFindCharacteristic(characteristic));
  }

  async updateCharacteristic(
    id: string,
    characteristic: CharacteristicMeta,
  ): Promise<null | CharacteristicMeta> {
    const product = await this.getProduct(id);

    const updateCharacteristics = product.meta.characteristics.filter(
      this.cbFilterCharacteristic(characteristic),
    );

    updateCharacteristics.push(characteristic);
    product.meta.characteristics = updateCharacteristics;

    const resultProduct = await this.productsRepository.save(product);
    const characteristics = resultProduct.meta?.characteristics;
    if (!characteristics) {
      throw new BadRequestException();
    }
    return characteristics.find(this.cbFindCharacteristic(characteristic));
  }

  async deleteCharacteristic(
    id: string,
    characteristic: CharacteristicMeta,
  ): Promise<void> {
    const product = await this.getProduct(id);

    product.meta.characteristics = product.meta.characteristics.filter(
      this.cbFilterCharacteristic(characteristic),
    );
    await this.productsRepository.save(product);
  }

  private async newProductFromDto(source: ProductDto): Promise<Product> {
    const dest = new Product();
    return this.updateProductFromDto(dest, source);
  }

  private async updateProductFromDto(
    dest: Product,
    source: ProductDto,
  ): Promise<Product> {
    dest.name = source.name;
    dest.meta = source.meta;
    if (source.catalogs) {
      dest.catalogs = await Promise.all(
        source.catalogs.map(
          async (dto) => await this.catalogService.getOne(dto.id),
        ),
      );
    }
    return dest;
  }
}
