import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Role } from '../../generated/prisma/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class RdacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!user) {
      throw new ForbiddenException('User not found in request');
    }

    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      this.logger.warn('RDAC Access Denied', {
        userId: user.id,
        userRole: user.role,
        requiredRoles,
      });
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
