import { Module } from "@nestjs/common";
import { join } from "path/posix";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";


import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from "@nestjs/serve-static";
import { DataSource } from "typeorm";

import { User } from "./model/user.entity";
import { Role } from "./model/role.entity";
import { Product } from "./model/product.entity";
import { Catalog } from "./model/catalog.entity";

import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";
import { RolesModule } from "./roles/roles.module";
import { AuthModule } from "./auth/auth.module";
import { ProductModule } from "./product/product.module";
import { CatalogModule } from "./catalog/catalog.module";
import { CartModule } from "./cart/cart.module";
import { SendModule } from "./send/send.module";
import { ReportService } from './report/report.service';
import { ReportController } from './report/report.controller';
import { ReportModule } from './report/report.module';
import { TelegramModule } from './telegram/telegram.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env"
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [ User, Role, Product, Catalog ],
      synchronize: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public")
    }),
    MailerModule.forRoot({
      transport: {
        host: "smtp.yandex.ru",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_LOGIN,
          pass: process.env.EMAIL_PASSWORD
        }
      },
      defaults: {
        from: "Интернет магазин valira-decor.ru <office@energy-soft.ru>"
      },
      template: {
        dir: process.cwd() + "/templates/",
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true
        }
      }
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ProductModule,
    CatalogModule,
    CartModule,
    SendModule,
    ReportModule,
    TelegramModule
  ],
  controllers: [ AppController, ReportController ],
  providers: [ AppService, ReportService ]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
