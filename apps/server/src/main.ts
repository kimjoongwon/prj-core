import { AppModule } from './gateway/app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { PrismaClientExceptionFilter } from '@shared';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { CustomValidationPipe } from './shared/pipes/custom-validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapterHost.httpAdapter));
  app.useGlobalPipes(new CustomValidationPipe());

  app.useGlobalInterceptors();

  const config = new DocumentBuilder().setVersion('1.0.0').addBearerAuth().build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: [
      'http://localhost:4173',
      'http://localhost:3004',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://10.0.2.2:8082',
      'http://localhost:8081',
      'http://192.168.233.197:3005',
      'http://192.168.233.197:5173',
      'http://192.168.233.197',
      'http://localhost',
      'https://wallyops.com',
    ],
    credentials: true,
  });
  await app.listen(3005);
}

bootstrap();
