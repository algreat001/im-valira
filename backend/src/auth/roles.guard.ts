import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ context.getHandler(), context.getClass() ],
    );
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
      throw new UnauthorizedException();
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.verify(token);
    const user = await this.userService.findUser(decoded);
    if (!user) {
      throw new UnauthorizedException();
    }
    req.user = user;
    return user.roles.some((role) => requiredRoles.includes(role.role));
  }
}
