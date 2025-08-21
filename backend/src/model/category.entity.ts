import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';
import { CategoryDto } from '@/dto';
import { CategoryMeta } from './meta';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  hasChildren: boolean;

  @Column({ type: 'jsonb', nullable: true })
  meta: CategoryMeta;

  @ManyToMany(() => Product, (product) => product.categories)
  @JoinTable()
  products: Product[];

  @ManyToOne(() => Category, (catalog) => catalog.category_id)
  parent: Category;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedDate: Date;

  get dto(): CategoryDto {
    return {
      category_id: this.category_id,
      name: this.name,
      meta: this.meta,
      products: this.products && this.products.map((product) => product.dto),
      parent: this.parent && this.parent.category_id,
      hasChildren: this?.hasChildren ?? false,
    };
  }

  static fromDto(dto: CategoryDto): Category {
    const category = new Category();
    category.category_id = dto.category_id;
    category.name = dto.name;
    category.meta = dto.meta;
    category.hasChildren = dto.hasChildren ?? false;


    return category;
  }
}
