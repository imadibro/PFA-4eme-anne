import { CanActivate, ExecutionContext, Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '../enums/index.js';

@Injectable()
export class PrestataireOwnershipGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const prestataireId = request.params.id;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    if (user.userRole === UserRole.ADMIN) {
      return true;
    }

    if (user.userRole !== UserRole.PRESTATAIRE) {
      throw new ForbiddenException('Only prestataires can access this resource');
    }

    request.prestataireId = prestataireId;
    request.checkOwnership = true;
    
    return true;
  }
}
