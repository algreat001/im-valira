import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminTagController } from './admin.tag.controller';
import { AdminTagService } from './admin.tag.service';
import { Tag } from '@/model/tag.entity';
import { RolesModule } from '@/roles/roles.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Tag, User, Role ]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ AdminTagController ],
  providers: [ AdminTagService ],
  exports: [ AdminTagService ],
})
export class AdminTagModule {}

