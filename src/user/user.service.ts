import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../models/user.model';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import { FirebaseAdminService } from '../firebase/firebase-admin.service';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private prismaService: PrismaService,
    private admin: FirebaseAdminService,
  ) {}
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(request)}`);

    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const totalUserWithSameEmail = await this.prismaService.profile.count({
      where: {
        email: registerRequest.email,
      },
    });

    if (totalUserWithSameEmail != 0) {
      throw new HttpException('Email sudah digunakan.', 400);
    }

    let firebaseUser;

    try {
      firebaseUser = await this.admin.getAuth().createUser({
        email: registerRequest.email,
        password: registerRequest.password,
      });
    } catch (error) {
      this.logger.error('Failed to create user in Firebase Auth', error);
      throw new HttpException(
        error instanceof Error ? error.message : 'Gagal membuat akun Firebase',
        400,
      );
    }
    try {
      const { password, ...profileData } = registerRequest;

      await this.prismaService.profile.create({
        data: {
          id: firebaseUser.uid,
          ...profileData,
        },
      });

      return {
        data: {
          status: 'ok',
          message: 'Akun berhasil dibuat.',
        },
      };
    } catch (error) {
      await this.admin.getAuth().deleteUser(firebaseUser.uid);
      this.logger.error(
        'Failed to save profile to database. Firebase user rolled back.',
        error,
      );
      throw new HttpException('Gagal membuat profil pengguna.', 500);
    }
  }

  async loginWithIdToken(request: LoginUserRequest): Promise<UserResponse> {}
}
