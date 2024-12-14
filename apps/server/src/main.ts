import { AppModule } from './gateway/app.module';
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { CustomClassSerializerInterceptor, PrismaClientExceptionFilter } from '@shared';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.use(cookieParser());
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new CustomClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapterHost.httpAdapter));

  const config = new DocumentBuilder()
    .setVersion('1.0.0')
    .setTitle('Galaxy Server')
    .addTag('Galaxy')
    .addBearerAuth()
    .build();

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
      'http://10.0.2.2:8081',
      'http://localhost:8081',
    ],
    credentials: true,
  });
  await app.listen(3005);
}

bootstrap();
