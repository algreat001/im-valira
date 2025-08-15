import { Module } from '@nestjs/common';
import { join } from 'path/posix';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';


import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DataSource } from 'typeorm';

import { User } from './model/user.entity';
import { Role } from './model/role.entity';
import { Product } from './model/product.entity';
import { Category } from './model/category.entity';
import { ProductVariant } from './model/product.variant.entity';
import { Cart } from './model/cart.entity';
import { Order } from './model/order.entity';
import { OrderItem } from './model/order.item.entity';

import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { CartModule } from './cart/cart.module';
import { SendModule } from './send/send.module';
import { ReportService } from './report/report.service';
import { ReportController } from './report/report.controller';
import { ReportModule } from './report/report.module';
import { TelegramModule } from './telegram/telegram.module';
import { OrderModule } from './order/order.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [ User, Role, Product, ProductVariant, Cart, Category, Order, OrderItem ],
      synchronize: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_LOGIN,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: 'Интернет магазин valira-decor.ru <office@energy-soft.ru>',
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forFeature([ User, Role, Product, Category, Cart, ProductVariant, Order, OrderItem ]),
    UsersModule,
    RolesModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    CartModule,
    SendModule,
    ReportModule,
    TelegramModule,
    OrderModule,
  ],
  controllers: [ AppController, ReportController ],
  providers: [ AppService, ReportService ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
