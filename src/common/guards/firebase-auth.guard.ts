import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { FirebaseAdminService } from '../../firebase/firebase-admin.service';
import { PrismaService } from '../prisma.service';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    private readonly prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }

    try {
      const decodedToken = await this.firebaseAdminService.verifyIdToken(token);

      const profile = await this.prisma.profile.upsert({
        where: { id: decodedToken.uid },
        update: {
          email: decodedToken.email || '',
        },
        create: {
          id: decodedToken.uid,
          email: decodedToken.email || '',
          fullName: decodedToken.name || null,
          phone: decodedToken.phone_number || '',
          role: 'USER',
        },
      });

      (request as AuthenticatedRequest).user = profile;
      return true;
    } catch (error) {
      this.logger.warn('Firebase Auth Guard failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
