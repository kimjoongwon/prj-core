import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/gateway/app.module';
import { beforeEach, describe, it } from 'vitest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/api/v1/admin/groups').expect(200);
  });

  it('/auth/login (POST)', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email: 'PROMISE@gmail.com', password: 'rkdmf12!@' })
      .expect(200);
  });

  it('/auth/refresh-token (POST)', () => {
    return request(app.getHttpServer()).post('/api/v1/auth/refresh-token').expect(200);
  });
});
