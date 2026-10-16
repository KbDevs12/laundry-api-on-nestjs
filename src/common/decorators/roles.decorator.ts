import { SetMetadata } from '@nestjs/common';
import { Role } from '../../generated/prisma/enums';

export const ROLES_KEY = 'roles';
export const ROLES = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
