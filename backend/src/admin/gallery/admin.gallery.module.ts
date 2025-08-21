import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';
import { RolesModule } from '@/roles/roles.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

import { AdminGalleryService } from './admin.gallery.service';
import { AdminGalleryController } from './admin.gallery.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Role ]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ AdminGalleryService ],
  controllers: [ AdminGalleryController ],
  exports: [ AdminGalleryService ],
})
export class AdminGalleryModule {}
