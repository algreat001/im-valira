import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DashboardMetricsDto } from '@/dto';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';
import { Order } from '@/model/order.entity';
import { Product } from '@/model/product.entity';
import { Category } from '@/model/category.entity';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getMainDashboard(): Promise<DashboardMetricsDto> {
    const [
      usersCount,
      newUsersThisMonth,
      pendingOrdersCount,
      unpaidOrdersCount,
      unshippedOrdersCount,
      cancelledOrdersThisMonth,
      cancelledOrdersPrevMonth,
      paymentsThisMonth,
      paymentsPrevMonth,
      productsCount,
      categoriesCount,
      refundedOrdersThisMonth,
      ordersThisMonth,
      lowStockProductsCount,
    ] = await Promise.all([
      this.countUsers(),
      this.countNewUsersThisMonth(),
      this.countNotCompleteOrders(),
      this.countUnpaidOrders(),
      this.countUnshippedOrders(),
      this.countCancelledThisMonth(),
      this.countCancelledPrevMonth(),
      this.sumPaymentsThisMonth(),
      this.sumPaymentsPrevMonth(),
      this.countProducts(),
      this.countCategories(),
      this.countRefundedThisMonth(),
      this.countOrdersThisMonth(),
      this.countLowStockProducts(),
    ]);

    return {
      usersCount,
      newUsersThisMonth,
      pendingOrdersCount,
      unpaidOrdersCount,
      unshippedOrdersCount,
      cancelledOrdersThisMonth,
      cancelledOrdersPrevMonth,
      paymentsThisMonth,
      paymentsPrevMonth,
      productsCount,
      categoriesCount,
      refundedOrdersThisMonth,
      ordersThisMonth,
      lowStockProductsCount,
    };
  }

  private firstDayOfCurrentMonth(): Date {
    const d = new Date();
    d.setUTCDate(1);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  private firstDayOfNextMonth(from: Date): Date {
    return new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + 1, 1, 0, 0, 0, 0));
  }

  private firstDayOfPrevMonth(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1, 0, 0, 0, 0));
  }

  private endOfPrevMonthRange(): Date {
    const prev = this.firstDayOfPrevMonth();
    return this.firstDayOfNextMonth(prev);
  }

  private async countUsers(): Promise<number> {
    return this.usersRepository.count();
  }

  private async countNewUsersThisMonth(): Promise<number> {
    const start = this.firstDayOfCurrentMonth();
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.createdDate >= :start', { start })
      .getCount();
  }

  private async countPendingOrders(): Promise<number> {
    // считаем "в ожидании": pending и processing
    return this.orderRepository
      .createQueryBuilder('o')
      .where('o.status IN (:...st)', { st: [ 'pending', 'processing' ] })
      .getCount();
  }

  private async countNotCompleteOrders(): Promise<number> {
    return this.orderRepository
      .createQueryBuilder('o')
      .where('o.is_completed = :completed', { completed: false })
      .getCount();
  }

  private async countUnpaidOrders(): Promise<number> {
    return this.orderRepository
      .createQueryBuilder('o')
      .where('o.is_paid = :paid', { paid: false })
      .getCount();
  }

  private async countUnshippedOrders(): Promise<number> {
    // не отгружены: не shipped и не delivered
    return this.orderRepository
      .createQueryBuilder('o')
      .where('o.status NOT IN (:...st)', { st: [ 'shipped', 'delivered' ] })
      .andWhere('o.is_completed = :completed', { completed: false })
      .getCount();
  }

  private async countCancelledThisMonth(): Promise<number> {
    const start = this.firstDayOfCurrentMonth();
    const end = this.firstDayOfNextMonth(start);
    return this.orderRepository
      .createQueryBuilder('o')
      .where('o.status = :st', { st: 'cancelled' })
      .andWhere('o.createdDate >= :start AND o.createdDate < :end', { start, end })
      .getCount();
  }

  private async countCancelledPrevMonth(): Promise<number> {
    const start = this.firstDayOfPrevMonth();
    const end = this.endOfPrevMonthRange();
    return this.orderRepository
      .createQueryBuilder('o')
      .where('o.status = :st', { st: 'cancelled' })
      .andWhere('o.createdDate >= :start AND o.createdDate < :end', { start, end })
      .getCount();
  }

  private async sumPaymentsThisMonth(): Promise<number> {
    const start = this.firstDayOfCurrentMonth();
    const end = this.firstDayOfNextMonth(start);
    const raw = await this.orderRepository
      .createQueryBuilder('o')
      .select('COALESCE(SUM( (o.meta->>\'total_price\')::numeric ), 0)', 'sum')
      .where('o.is_paid = :paid', { paid: true })
      .andWhere('o.createdDate >= :start AND o.createdDate < :end', { start, end })
      .getRawOne<{ sum: string }>();
    return Number(raw?.sum ?? 0);
  }

  private async sumPaymentsPrevMonth(): Promise<number> {
    const start = this.firstDayOfPrevMonth();
    const end = this.endOfPrevMonthRange();
    const raw = await this.orderRepository
      .createQueryBuilder('o')
      .select('COALESCE(SUM( (o.meta->>\'total_price\')::numeric ), 0)', 'sum')
      .where('o.is_paid = :paid', { paid: true })
      .andWhere('o.createdDate >= :start AND o.createdDate < :end', { start, end })
      .getRawOne<{ sum: string }>();
    return Number(raw?.sum ?? 0);
  }

  private async countProducts(): Promise<number> {
    return this.productRepository.count();
  }

  private async countCategories(): Promise<number> {
    return this.categoryRepository.count();
  }

  private async countRefundedThisMonth(): Promise<number> {
    const start = this.firstDayOfCurrentMonth();
    const end = this.firstDayOfNextMonth(start);
    return this.orderRepository
      .createQueryBuilder('o')
      .where('o.status = :st', { st: 'refunded' })
      .andWhere('o.createdDate >= :start AND o.createdDate < :end', { start, end })
      .getCount();
  }

  private async countOrdersThisMonth(): Promise<number> {
    const start = this.firstDayOfCurrentMonth();
    const end = this.firstDayOfNextMonth(start);
    return this.orderRepository
      .createQueryBuilder('o')
      .where('o.createdDate >= :start AND o.createdDate < :end', { start, end })
      .getCount();
  }

  private async countLowStockProducts(): Promise<number> {
    // нет данных об остатках — возвращаем 0 осознанно
    return 0;
  }
}
