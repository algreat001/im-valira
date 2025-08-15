import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { OrderItem } from './order.item.entity';
import { OrderDto, UpdateOrderDto } from '../dto';
import { DeliveryMeta, OrderMeta } from './meta';

export type OrderStatus =
  'pending'
  | 'completed'
  | 'cancelled'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'refunded'
  | 'failed'
  | 'unknown';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => User, (user) => user.user_id)
  user: User;

  @Column()
  number: string;

  @Column({ type: 'jsonb', nullable: true })
  meta: OrderMeta;

  @Column()
  status: OrderStatus;

  @Column()
  is_completed: boolean;

  @OneToMany(() => OrderItem, (item) => item.order)
  items: OrderItem[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdDate: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedDate: Date;

  get dto(): OrderDto {
    return {
      order_id: this.order_id,
      number: this.number,
      status: this.status,
      meta: this.meta,
      is_completed: this.is_completed,
      created_at: this.createdDate.toUTCString(),
      updated_at: this.updatedDate.toUTCString(),
    };
  }

  static fromUser(user: User, meta?: OrderMeta) {
    const delivery = {
      city: user.deliveryCity,
      address: user.deliveryAddress,
      postal_code: user.postalCode,
      phone: user.phone,
      name: [ user.firstName, user.middleName, user.lastName ].filter(Boolean).join(' '),
    } as DeliveryMeta;

    const order = new Order();
    order.user = user;
    order.number = `ORD-${user.user_id}-${Date.now()}`;
    order.status = 'pending';
    order.is_completed = false;
    order.meta = {
      payment_method: meta.payment_method,
      description: meta.description,
      total_price: meta.total_price,
      delivery: delivery,
    };
    return order;
  }

  static updateFromDto(order: Order, dto: UpdateOrderDto) {
    order.status = dto?.status ?? order.status;
    order.meta = dto?.meta ?? order.meta;
    order.is_completed = dto?.is_completed ?? order.is_completed;
  }

}
