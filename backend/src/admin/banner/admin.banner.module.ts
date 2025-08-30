import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminBannerController } from './admin.banner.controller';
import { AdminBannerService } from './admin.banner.service';
import { Banner } from '@/model/banner.entity';
import { RolesModule } from '@/roles/roles.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Banner, User, Role ]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ AdminBannerController ],
  providers: [ AdminBannerService ],
  exports: [ AdminBannerService ],
})
export class AdminBannerModule {}

