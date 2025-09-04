import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';
import { TagDto } from '@/dto';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  tag_id: number;

  @Column()
  name: string;

  @Column()
  link: string;

  @Column({ nullable: true })
  icon: string;

  //todo для реализации акций - надо подумать над правами - для пользователей и для групп пользователей
  @Column({ type: 'jsonb', default: {} })
  meta: Record<string, any>;

  @ManyToMany(() => Product, (product) => product.tags)
  @JoinTable()
  products: Product[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedDate: Date;

  get dto(): TagDto {
    return {
      tag_id: this.tag_id,
      name: this.name,
      link: this.link,
      icon: this.icon,
      meta: this.meta || {}, // добавлено
      products: this.products && this.products.map((product) => product.dto),
    } as any;
  }

  static fromDto(dto: TagDto): Tag {
    const tag = new Tag();
    tag.tag_id = dto.tag_id;
    tag.name = dto.name;
    tag.link = dto.link;
    tag.icon = dto.icon;
    tag.meta = dto.meta || {}; // добавлено
    return tag;
  }
}
