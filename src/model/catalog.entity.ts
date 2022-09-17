import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  ManyToOne
} from "typeorm";
import { Product } from "./product.entity";
import { CatalogDto } from "../dto";
import { CatalogMeta } from "./meta";

@Entity()
export class Catalog {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: "jsonb", nullable: true })
  meta: CatalogMeta;

  @ManyToMany(() => Product, (product) => product.catalogs)
  @JoinTable()
  products: Product[];

  @ManyToOne(() => Catalog, (catalog) => catalog.id)
  parent: Catalog;

  @CreateDateColumn({
    type: "timestamptz"
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: "timestamptz"
  })
  updatedDate: Date;

  get dto(): CatalogDto {
    return {
      id: this.id,
      name: this.name,
      meta: this.meta,
      products: this.products.map((product) => product.dto),
      parent: this.parent.id
    };
  }
}
