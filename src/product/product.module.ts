import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { Product } from '../model/product.entity';
import { Catalog } from '../model/catalog.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { CatalogModule } from '../catalog/catalog.module';
import { UsersModule } from '../users/users.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Catalog]),
    RolesModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    TelegramModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
