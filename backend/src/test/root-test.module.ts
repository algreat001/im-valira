import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';
import { Product } from '@/model/product.entity';
import { ProductVariant } from '@/model/product.variant.entity';
import { Cart } from '@/model/cart.entity';
import { Category } from '@/model/category.entity';
import { Order } from '@/model/order.entity';
import { OrderItem } from '@/model/order.item.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { TelegramService } from '@/telegram/telegram.service';
import { ConfigModule } from '@nestjs/config';

const mailerMock: Partial<MailerService> = {
  sendMail: async () => true as any,
};

const telegramMock: Partial<TelegramService> = {
  sendMessage: async () => true,
};

// Минимальный модуль для юнит и e2e тестов без внешних зависимостей (БД, почта и т.п.)
// Используется, чтобы избежать ошибок Nest can't resolve dependencies ... из AppModule.
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
    }),
    TypeOrmModule.forFeature([ User, Role, Product, ProductVariant, Cart, Category, Order, OrderItem ]),
  ],
  controllers: [ AppController ],
  providers: [
    AppService,
    { provide: MailerService, useValue: mailerMock },
    { provide: TelegramService, useValue: telegramMock },
  ],
  exports: [ AppService ],
})
export class RootTestModule {}
