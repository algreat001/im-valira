import { Module } from "@nestjs/common";
import { CatalogService } from "./catalog.service";
import { CatalogController } from "./catalog.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../model/product.entity";
import { Catalog } from "../model/catalog.entity";
import { RolesModule } from "../roles/roles.module";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Product, Catalog ]),
    RolesModule,
    AuthModule,
    UsersModule
  ],
  providers: [ CatalogService ],
  controllers: [ CatalogController ],
  exports: [ CatalogService ]
})
export class CatalogModule {}
