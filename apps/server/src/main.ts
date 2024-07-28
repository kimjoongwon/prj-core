import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './domains/app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { CustomClassSerializerInterceptor } from '@shared';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new CustomClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setVersion('1.0.0')
    .setTitle('PROMISE Server')
    .addTag('PROMISE')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);

  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: ['http://localhost:3004', 'http://localhost:3000'],
    credentials: true,
  });
  await app.listen(3005);
}

bootstrap();
