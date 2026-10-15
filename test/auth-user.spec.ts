import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';
import { ErrorFilter } from '../src/common/error.filter';

describe('UserController', () => {
  let app: INestApplication;
  let testService: TestService;

  const email = 'test@example.com';

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ErrorFilter());
    await app.init();

    testService = app.get(TestService);
  });

  afterAll(async () => {
    await testService.deleteUser(email);
    await app.close();
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteUser(email);
    });

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
        .send({
          email,
          fullName: 'Test User',
          phone: '+6281234567890',
          password: 'Password123!',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.status).toBe('ok');
      expect(await testService.getUser(email)).not.toBeNull();
    });

    it('should be rejected if email already used', async () => {
      await testService.createUser({
        email,
        password: 'Password123!',
        fullName: 'Test User',
        phone: '+6281234567890',
      });

      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          email,
          fullName: 'Test User',
          phone: '+6281234567891',
          password: 'Password123!',
        });

      expect(response.status).toBe(400);
    });
  });
});
