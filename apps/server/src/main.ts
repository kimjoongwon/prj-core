import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
// import { PrismaClientExceptionFilter } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  // const { httpAdapter } = app.get(HttpAdapterHost);

  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  patchNestJsSwagger();

  const config = new DocumentBuilder()
    .setVersion('2.0')
    .setTitle('COC Server')
    .setDescription('The coc API description')
    .setVersion('1.0')
    .addTag('coc')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.listen(3005);
}

bootstrap();
