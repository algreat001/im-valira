import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Cart } from '@/model/cart.entity';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';
import { Product } from '@/model/product.entity';
import { ProductVariant } from '@/model/product.variant.entity';
import { Order } from '@/model/order.entity';
import { OrderItem } from '@/model/order.item.entity';

import { RolesModule } from '@/roles/roles.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { ProductModule } from '@/product/product.module';
import { CartModule } from '@/cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Cart, Product, ProductVariant, Order, OrderItem, User, Role ]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ProductModule),
    forwardRef(() => CartModule),
  ],

  controllers: [ OrderController ],
  providers: [ OrderService ],
  exports: [ OrderService ],
})
export class OrderModule {}
