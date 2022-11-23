import { Column, CreateDateColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { CartMeta } from "./meta";

export class Cart {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "jsonb", nullable: true })
  meta: CartMeta;


  @CreateDateColumn({
    type: "timestamptz"
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: "timestamptz"
  })
  updatedDate: Date;

}
