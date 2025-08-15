import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../model/cart.entity';
import { User } from '../model/user.entity';
import { Role } from '../model/role.entity';
import { Product } from '../model/product.entity';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ProductModule } from '../product/product.module';
import { ProductVariant } from '../model/product.variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Cart, Product, ProductVariant, User, Role ]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ProductModule),
  ],

  controllers: [ CartController ],
  providers: [ CartService ],
  exports: [ CartService ],
})
export class CartModule {}
