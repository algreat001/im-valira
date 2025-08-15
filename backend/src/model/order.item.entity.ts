import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { OrderItemDto } from '../dto';
import { Order } from './order.entity';
import { Cart } from './cart.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  order_item_id: number;

  @ManyToOne(() => Order, (order) => order.order_id)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ nullable: false })
  order_id: number;

  @ManyToOne(() => Product, (product) => product.product_id)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ nullable: false })
  product_id: number;

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

  get dto(): OrderItemDto {
    return {
      order_item_id: this.order_item_id,
      product_id: this.product_id,
      order_id: this.order_id,
      article: this.article,
      name: this.name,
      price: this.price,
      image: this.image,
      quantity: this.quantity,
      variant_id: this.variant_id ?? undefined,
    } as OrderItemDto;
  }

  static fromCartItem(order: Order, cart: Cart) {
    const item = new OrderItem();
    item.order = order;
    item.product = cart.product;
    item.article = cart.article;
    item.name = cart.name;
    item.price = cart.price;
    item.image = cart.image;
    item.quantity = cart.quantity;
    item.variant_id = cart.variant_id;
    return item;
  }
}
