import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';
import { CartItemDto } from '@/dto';
import { ProductVariant } from './product.variant.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  cart_item_id: number;

  @ManyToOne(() => Product, (product) => product.product_id, { eager: true })
  product: Product;

  @ManyToOne(() => User, (user) => user.user_id, { eager: true })
  user: User;

  @Column({ type: 'varchar', nullable: true })
  article: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  price: number;

  @Column({ type: 'varchar' })
  image: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'integer', nullable: true })
  variant_id: number;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedDate: Date;

  get dto(): CartItemDto {
    return {
      cart_item_id: this.cart_item_id,
      product_id: this.product.product_id,
      article: this.article,
      name: this.name,
      price: this.price,
      image: this.image,
      quantity: this.quantity,
      variant_id: this.variant_id ?? undefined,
    } as CartItemDto;
  }

  static fromProduct(
    user: User,
    quantity: number,
    product: Product,
    variant?: ProductVariant,
  ): Cart {
    const cart = new Cart();
    cart.user = user;
    cart.product = product;
    cart.quantity = quantity;
    cart.article = (variant?.meta?.article || product.meta?.article) ?? undefined;
    cart.name = variant?.name || product.name;
    cart.price = variant?.meta.price ?? product.meta?.price ?? 0;
    cart.image = (variant?.meta?.image || product.meta?.image) ?? '';
    cart.variant_id = variant?.product_variant_id ?? undefined;
    return cart;
  }
}
