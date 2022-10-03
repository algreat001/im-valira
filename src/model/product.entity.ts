import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany
} from "typeorm";
import { Catalog } from "./catalog.entity";
import { ProductDto } from "../dto";
import { ProductMeta } from "./meta";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: "jsonb", nullable: true })
  meta: ProductMeta;

  @ManyToMany(() => Catalog, (catalog) => catalog.products)
  catalogs: Catalog[];

  @CreateDateColumn({
    type: "timestamptz"
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: "timestamptz"
  })
  updatedDate: Date;

  get dto(): ProductDto {
    return {
      id: `${this.id}`,
      name: this.name,
      meta: this.meta,
      catalogs: this.catalogs && this.catalogs.map((cat) => cat.dto)
    };
  }
}
