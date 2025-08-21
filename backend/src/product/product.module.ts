import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '@/roles/roles.module';
import { AuthModule } from '@/auth/auth.module';
import { Product } from '@/model/product.entity';
import { Category } from '@/model/category.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CategoryModule } from '@/category/category.module';
import { UsersModule } from '@/users/users.module';
import { TelegramModule } from '@/telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Product, Category ]),
    RolesModule,
    AuthModule,
    UsersModule,
    CategoryModule,
    TelegramModule,
  ],
  providers: [ ProductService ],
  controllers: [ ProductController ],
  exports: [ ProductService ],
})
export class ProductModule {}
