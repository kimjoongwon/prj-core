import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/gateway/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let authCookie: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const authResponse = await request(app.getHttpServer())
      .post('/api/v1/auth/token')
      .send({
        email: 'galaxy@gmail.com',
        password: 'rkdmf12!@',
      })
      .expect(200);

    authCookie = authResponse.headers['set-cookie'];

    console.log('authCookie', authCookie);
    console.log('authCookie', typeof authCookie);
  });

  it('/admin/excercise (GET)', async () => {
    console.log('authCookie', authCookie);

    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/main/exercises/new/edit')
      .set('Cookie', authCookie)
      .expect(200);

    console.log('response', response);
  });
});
// 'tenancyId=86204bdc-bcb7-4205-a08e-5a99cca16b7f; Path=/; HttpOnly',
// 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZDE5ZWU0MS0wODNmLTQ0NTctOWNmNC05NWZlZGRhZTFiNGUiLCJpYXQiOjE3Mzg4OTQyNzEsImV4cCI6MTczOTQ5OTA3MX0.LNHxLmE64UwVQ7Ci3xmkyvyQH-eAdNXw0igAnVIpuf8; Path=/; HttpOnly',
// 'accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZDE5ZWU0MS0wODNmLTQ0NTctOWNmNC05NWZlZGRhZTFiNGUiLCJpYXQiOjE3Mzg4OTQyNzEsImV4cCI6MTczODk4MDY3MX0.IGvvBvToGHtxopfwVQtnBNPqCcJ_QNOwvNDgqnwE83M; Path=/; HttpOnly'
