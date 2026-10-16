import { Inject, Injectable } from '@nestjs/common';
import { FirebaseAdminService } from './firebase-admin.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as admin from 'firebase-admin/messaging';
import { Logger } from 'winston';

@Injectable()
export class FcmService {
  constructor(
    private readonly firebaseAdminService: FirebaseAdminService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendToDevice(
    token: string,
    message: Omit<admin.Message, 'token'>,
  ): Promise<string> {
    try {
      const messaging = this.firebaseAdminService.getMessaging();
      const response = await messaging.send({
        ...message,
        token,
      });

      this.logger.info('FCM message sent successfully', {
        messageId: response,
        tokenPrefix: token.substring(0, 10) + '...',
      });

      return response;
    } catch (error) {
      this.logger.error('Failed to send FCM message', {
        error: error instanceof Error ? error.message : String(error),
        tokenPrefix: token.substring(0, 10) + '...',
      });
      throw error;
    }
  }

  async sendToDevices(
    tokens: string[],
    message: Omit<admin.Message, 'token'>,
  ): Promise<admin.BatchResponse> {
    if (tokens.length === 0) {
      this.logger.warn('No token provided for FCM');
      return { responses: [], successCount: 0, failureCount: 0 };
    }

    try {
      const messaging = this.firebaseAdminService.getMessaging();

      const messages: admin.Message[] = tokens.map((token) => ({
        ...message,
        token,
      }));

      const response = await messaging.sendEach(messages);

      this.logger.info('FCM sendEach completed', {
        successCount: response.successCount,
        failureCount: response.failureCount,
      });

      if (response.failureCount > 0) {
        const invalidTokens: string[] = [];

        response.responses.forEach((resp, idx) => {
          if (
            !resp.success &&
            resp.error?.code === 'messaging/registration-token-not-registered'
          ) {
            invalidTokens.push(tokens[idx]);
          }
        });

        if (invalidTokens.length > 0) {
          this.logger.warn(
            'Found invalid FCM tokens, should be removed from DB',
            {
              invalidTokensCount: invalidTokens.length,
            },
          );

          // TODO: panggil DeviceTokenService untuk soft-delete token.
        }
      }

      return response;
    } catch (error) {
      this.logger.error('Failed to send FCM messages', {
        error: error instanceof Error ? error.message : String(error),
        tokensCount: tokens.length,
      });

      throw error;
    }
  }
}
