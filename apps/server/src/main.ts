import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
// import { patchNestJsSwagger } from 'nestjs-zod';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  // app.useGlobalPipes(new ValidationPipe());
  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setVersion('1.0.0')
    .setTitle('PROMISE Server')
    .addTag('PROMISE')
    .addBearerAuth()
    .setBasePath('api')
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: ['http://localhost:3004'],
    credentials: true,
  });
  await app.listen(3005);
}

bootstrap();
