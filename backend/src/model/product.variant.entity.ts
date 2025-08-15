import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ProductVariantDto } from '../dto';
import { ProductMeta } from './meta';
import { Product } from './product.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  product_variant_id: number;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  meta: Partial<ProductMeta>;

  @ManyToOne(() => Product, (product) => product.product_id)
  product: Product;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedDate: Date;

  get dto(): ProductVariantDto {
    return {
      product_variant_id: this.product_variant_id,
      name: this.name,
      meta: this.meta,
    };
  }

  static fromDto(dto: ProductVariantDto, product: Product): ProductVariant {
    const productVariant = new ProductVariant();
    productVariant.product_variant_id = dto.product_variant_id;
    productVariant.product = product;
    productVariant.name = dto.name;
    productVariant.meta = dto.meta;

    return productVariant;
  }

}
