import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductDto } from '@/dto';
import { ProductMeta } from './meta';
import { ProductVariant } from './product.variant.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  meta: ProductMeta;

  @ManyToMany(() => Category, (catalog) => catalog.products, { eager: true })
  categories: Category[];

  @OneToMany(() => ProductVariant, (variant) => variant.product, { eager: true })
  variants: ProductVariant[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedDate: Date;

  get dto(): ProductDto {
    return {
      product_id: this.product_id,
      name: this.name,
      meta: this.meta,
      categories: this.categories && this.categories.map((cat) => cat.category_id),
      variants: this.variants && this.variants.map(variant => variant.dto),
    };
  }

  static fromDto(dto: ProductDto, categories?: Category[]): Product {
    const product = new Product();
    product.product_id = dto.product_id;
    product.name = dto.name;
    product.meta = dto.meta;
    if (!!categories) {
      product.categories = dto.categories.map(
        (catId) => categories.find(cat => cat.category_id === catId),
      ).filter(Boolean) as Category[];
    }

    return product;
  }
}
