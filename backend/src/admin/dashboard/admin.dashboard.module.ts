import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';
import { RolesModule } from '@/roles/roles.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

import { AdminDashboardService } from './admin.dashboard.service';
import { AdminDashboardController } from './admin.dashboard.controller';
import { Cart } from '@/model/cart.entity';
import { Product } from '@/model/product.entity';
import { ProductVariant } from '@/model/product.variant.entity';
import { Order } from '@/model/order.entity';
import { OrderItem } from '@/model/order.item.entity';
import { Category } from '@/model/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Cart, Product, ProductVariant, Order, OrderItem, User, Role, Category ]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ AdminDashboardService ],
  controllers: [ AdminDashboardController ],
  exports: [ AdminDashboardService ],
})
export class AdminDashboardModule {}
