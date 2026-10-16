import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { z } from 'zod';

import { App, cert, getApps, initializeApp } from 'firebase-admin/app';
import { Auth, DecodedIdToken, getAuth } from 'firebase-admin/auth';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

import { ValidationService } from '../common/validation.service';

const firebaseEnvSchema = z.object({
  FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is required'),
  FIREBASE_CLIENT_EMAIL: z.string().email('Invalid FIREBASE_CLIENT_EMAIL'),
  FIREBASE_PRIVATE_KEY: z.string().min(1, 'FIREBASE_PRIVATE_KEY is required'),
});

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private app!: App;

  constructor(
    private readonly configService: ConfigService,
    private readonly validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  onModuleInit(): void {
    const env = this.validationService.validate(firebaseEnvSchema, {
      FIREBASE_PROJECT_ID: this.configService.get<string>(
        'FIREBASE_PROJECT_ID',
      ),
      FIREBASE_CLIENT_EMAIL: this.configService.get<string>(
        'FIREBASE_CLIENT_EMAIL',
      ),
      FIREBASE_PRIVATE_KEY: this.configService.get<string>(
        'FIREBASE_PRIVATE_KEY',
      ),
    });

    const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    const existingApp = getApps().find((app) => app.name === '[DEFAULT]');

    if (existingApp) {
      this.app = existingApp;
      this.logger.info('Firebase Admin SDK already initialized');
      return;
    }

    this.app = initializeApp({
      credential: cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });

    this.logger.info('Firebase Admin SDK initialized successfully');
  }

  getAuth(): Auth {
    return getAuth(this.app);
  }

  getMessaging(): Messaging {
    return getMessaging(this.app);
  }

  async verifyIdToken(token: string): Promise<DecodedIdToken> {
    try {
      return await this.getAuth().verifyIdToken(token);
    } catch (error: unknown) {
      this.logger.warn('Failed to verify Firebase ID token', {
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
}
