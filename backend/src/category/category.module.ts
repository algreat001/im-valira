import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../model/product.entity';
import { Category } from '../model/category.entity';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Product, Category ]),
    RolesModule,
    AuthModule,
    UsersModule,
  ],
  providers: [ CategoryService ],
  controllers: [ CategoryController ],
  exports: [ CategoryService ],
})
export class CategoryModule {}
