import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter, PrismaClientExceptionFilter, logConfig } from '@shared/backend';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger as NestLogger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const startTime = Date.now();
  const logger = new NestLogger('Bootstrap');

  logger.log('🚀 Starting server...');

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    // logger: logConfig.level,
  });
  const httpAdapterHost = app.get(HttpAdapterHost);

  // Cookie parser 미들웨어 추가
  // @ts-ignore
  app.use(cookieParser());

  app.useLogger(app.get(Logger));
  // @ts-ignore
  app.set('query parser', 'extended');
  app.useGlobalFilters(
    // @ts-ignore
    new AllExceptionsFilter(httpAdapterHost.httpAdapter),
    // @ts-ignore
    new PrismaClientExceptionFilter(httpAdapterHost.httpAdapter),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // DTO에 정의되지 않은 속성 자동 제거
      // forbidNonWhitelisted: true,
      // whitelist: true, // DTO에 정의되지 않은 속성 자동 제거
      // transformOptions: {
      //   excludeExtraneousValues: true, // class-transformer에서 @Expose()가 없는 속성 제거
      // },
    }),
  );
  const config = new DocumentBuilder().setVersion('1.0.0').addBearerAuth().build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  // @ts-ignore
  const document = SwaggerModule.createDocument(app, config, options);

  // @ts-ignore
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: [
      'http://localhost:4173',
      'http://localhost:3004',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://10.0.2.2:8082',
      'http://localhost:8081',
      'http://localhost:8082',
      'http://192.168.233.197:3005',
      'http://192.168.233.197:5173',
      'http://192.168.233.197',
      'http://localhost',
      'https://wallyops.com',
    ],
    credentials: true,
  });

  const port = 3005;
  await app.listen(port);

  const bootTime = Date.now() - startTime;
  logger.log('🎉 Server started successfully!');
}

bootstrap();
