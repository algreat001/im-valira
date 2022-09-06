import { Module, RequestMethod, MiddlewareConsumer } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ServeStaticModule } from "@nestjs/serve-static";
import { DataSource } from "typeorm";
import { User } from "./model/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { secret } from "./utils/constants";
import { join } from "path/posix";
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { UsersModule } from "./users/users.module";
import { isAuthenticated } from "./app.middleware";
import { ConfigModule } from "@nestjs/config";
import { RolesService } from "./roles/roles.service";
import { RolesController } from "./roles/roles.controller";
import { RolesModule } from "./roles/roles.module";
import { Role } from "./model/role.entity";
import { AuthModule } from "./auth/auth.module";

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
      entities: [ User, Role ],
      synchronize: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public")
    }),
    UsersModule,
    RolesModule,
    AuthModule
  ],
  controllers: [ AppController ],
  providers: [ AppService ]
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
