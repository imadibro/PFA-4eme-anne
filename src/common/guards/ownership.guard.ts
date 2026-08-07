import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enums/index.js';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const params = request.params;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.userRole === UserRole.ADMIN) {
      return true;
    }

    const userId = params.id || params.userId;
    
    if (userId && userId !== user.id) {
      throw new ForbiddenException('You can only access your own data');
    }

    return true;
  }
}
