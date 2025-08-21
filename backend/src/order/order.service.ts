import { BadRequestException, MethodNotAllowedException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrderDto, NewOrderDto, OrderDto, OrderItemDto, UpdateOrderDto, UserDto } from '@/dto';
import { Cart } from '@/model/cart.entity';
import { User } from '@/model/user.entity';
import { Order, OrderStatus } from '@/model/order.entity';
import { OrderItem } from '@/model/order.item.entity';
import { CartService } from '@/cart/cart.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cartService: CartService,
    private userService: UsersService,
  ) {}

  async findAll(status?: OrderStatus): Promise<OrderDto[]> {
    const orders = await this.orderRepository.find({
      where: { status },
      relations: { user: true, items: true },
    });
    return orders.map(item => item.dto);

  }

  async findAllByUser(user: User, is_completed: boolean): Promise<OrderDto[]> {
    const orders = await this.orderRepository.find({
      where: { user: { user_id: user.user_id }, is_completed },
      relations: { user: true },
    });
    return orders.map(item => item.dto);
  }

  calcTotalPrice(cartItems: Cart[]): number {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  async createFromCart(user: User, createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const cartItems = await this.cartRepository.find({
      where: { user: { user_id: user.user_id } },
      relations: { product: true, user: true },
    });
    if (cartItems.length === 0) {
      console.log(`[order.createFromCart] not found cart items: user: ${user.email}`);
      throw new BadRequestException();
    }

    createOrderDto.total_price = this.calcTotalPrice(cartItems);

    const order = await this.orderRepository.save(Order.fromUser(user, createOrderDto));
    if (!order) {
      console.log(`[order.createFromCart] error create order: user: ${user.email}`);
      throw new BadRequestException();
    }
    order.items = await this.orderItemRepository.save(cartItems.map(
      cartItem => OrderItem.fromCartItem(order, cartItem),
    ));
    if (!order.items || order.items.length === 0) {
      console.log(`[order.createFromCart] error create order items: user: ${user.email}`);
      throw new BadRequestException();
    }
    await this.cartService.removeAll(user);
    return order.dto;
  }

  async cancelRequest(user: User, id: number): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { order_id: id, user: { user_id: user.user_id } } });
    if (order.is_completed) {
      console.log(`[cart.cancelRequest] not found order: ${id} user: ${user.email}`);
      throw new BadRequestException();
    }
    if (order.status === 'cancelled') {
      console.log(`[cart.cancelRequest] order already canceled: ${id} user: ${user.email}`);
      throw new BadRequestException();
    }
    if (order.status !== 'pending') {
      console.log(`[cart.cancelRequest] order is worked: ${id} user: ${user.email}`);
      throw new MethodNotAllowedException();
    }
    order.status = 'cancelled';
    order.is_completed = true;
    const result = await this.orderRepository.save(order);
    return result.dto;
  }

  findOneByUserId(user_id: number, order_id: number): Promise<Order | undefined> {
    return this.orderRepository.findOne({
      where: { order_id, user: { user_id } },
      relations: { items: true, user: true },
    });
  }


  async findItems(user: User, order_id: number): Promise<OrderItemDto[]> {
    const order = await this.findOneByUserId(user.user_id, order_id);
    if (!order) {
      console.log(`[order.findItems] Order item not found id: ${order_id}, user: ${user.email}`);
      throw new BadRequestException();
    }
    return order.items.map(item => item.dto);
  }

  async create(newOrderDto: NewOrderDto): Promise<OrderDto> {
    const user = await this.userService.findUser({ email: newOrderDto.email } as UserDto);
    if (!user) {
      console.log(`[order.create] User not found email: ${newOrderDto.email}`);
      throw new BadRequestException();
    }
    const order = Order.fromUser(user);
    const result = await this.orderRepository.save(order);
    return result.dto;
  }

  async update(order_id: number, updateOrderDto: UpdateOrderDto): Promise<OrderDto> {
    const order = await this.orderRepository.findOne({ where: { order_id }, relations: { items: true, user: true } });
    if (!order) {
      console.log(`[order.update] Order item not found id: ${order_id}`);
      throw new BadRequestException();
    }
    Order.updateFromDto(order, updateOrderDto);
    const result = await this.orderRepository.save(order);
    return result.dto;
  }

  async remove(order_id: number) {
    const order = await this.orderRepository.findOne({ where: { order_id } });
    if (!order) {
      console.log(`[order.remove] Order item not found id: ${order_id}`);
      throw new BadRequestException();
    }

    const result = await this.cartRepository.delete(order_id);
    return result.affected > 0;
  }

}
