import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RolesModule } from '@/roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/model/user.entity';
import { Role } from '@/model/role.entity';
import { secret } from '@/utils/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Role ]),
    JwtModule.register({
      secret,
      signOptions: { expiresIn: '2h' },
    }),
    forwardRef(() => UsersModule),
    forwardRef(() => RolesModule),
  ],
  controllers: [ AuthController ],
  providers: [ AuthService, JwtService ],
  exports: [ AuthService, JwtModule ],
})
export class AuthModule {}
