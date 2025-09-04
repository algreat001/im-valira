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
import { Tag } from '@/model/tag.entity';

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

  @ManyToMany(() => Tag, (tag) => tag.products, { eager: true })
  tags: Tag[];

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
      tags: this.tags.map(tag => tag.link),
    };
  }

  static fromDto(dto: ProductDto, categories?: Category[], tags?: Tag[]): Product {
    const product = new Product();
    product.product_id = dto.product_id;
    product.name = dto.name;
    product.meta = dto.meta;
    if (!!categories) {
      product.categories = (dto.categories ?? []).map(
        (catId) => categories.find(cat => cat.category_id === catId),
      ).filter(Boolean) as Category[];
    }
    if (!!tags) {
      product.tags = (dto.tags ?? []).map(
        (tagName) => tags.find(tag => tag.link === tagName),
      ).filter(Boolean) as Tag[];
    }

    return product;
  }
}
