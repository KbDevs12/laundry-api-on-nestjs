import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import { ErrorFilter } from '../src/common/error.filter';

describe('UserController', () => {
  let app: INestApplication;
  let testService: TestService;
  let logger: Logger;

  const email = 'test@example.com';
  const password = 'Password123!';
  const phone = '+6281234567890';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ErrorFilter());
    await app.init();

    testService = app.get(TestService);
    logger = app.get(WINSTON_MODULE_PROVIDER);

    await testService.deleteUser(email);
  });

  afterAll(async () => {
    await testService.deleteUser(email);
    await app.close();
  });

  describe('POST /api/users', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({ email: '', fullName: '', phone: '', password: '' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({ email, fullName: 'Test User', phone, password });

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe('ok');
      expect(await testService.getUser(email)).not.toBeNull();
    });

    it('should be rejected if email already used', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email,
          fullName: 'Test User',
          phone: '+6281234567891',
          password,
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/users/login', () => {
    it('should be rejected if idToken is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ idToken: 'invalid-token' });

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to login', async () => {
      const idToken = await testService.getIdToken(email, password);

      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({ idToken });

      logger.info(`Returned data: ${JSON.stringify(response.body)}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('Ok');
      expect(response.body.data.profile.email).toBe(email);
    });
  });
});
