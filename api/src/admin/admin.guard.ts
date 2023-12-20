
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ADMIN_KEY } from './admin.decorator';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UsersService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const adminNeeded = this.reflector.getAllAndOverride<boolean>(ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const { user } = context.switchToHttp().getRequest();
    return this.userService.findOneByJwt(user).then((user) => {
      return user.admin;
    });
  }
}