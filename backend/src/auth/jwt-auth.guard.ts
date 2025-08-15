import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    ) {
      throw new UnauthorizedException();
    }
    const token = req.headers.authorization.split(' ')[1];
    const decoded = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
    const user = await this.userService.findUser(decoded);
    if (!user) {
      throw new UnauthorizedException();
    }
    req.user = user;
    return true;
  }
}
