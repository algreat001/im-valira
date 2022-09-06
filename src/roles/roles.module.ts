import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../model/user.entity";
import { Role } from "../model/role.entity";
import { RolesController } from "./roles.controller";
import { RolesService } from "./roles.service";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([ Role, User ]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule)
  ],
  controllers: [ RolesController ],
  providers: [ RolesService ],
  exports: [ RolesService ]
})
export class RolesModule {}
