import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';
import { RolesModule } from '@/roles/roles.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

import { AdminProductService } from './admin.product.service';
import { AdminProductController } from './admin.product.controller';
import { Category } from '@/model/category.entity';
import { Product } from '@/model/product.entity';
import { ProductVariant } from '@/model/product.variant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Product, ProductVariant, Category, Role ]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ AdminProductService ],
  controllers: [ AdminProductController ],
  exports: [ AdminProductService ],
})
export class AdminProductModule {}
