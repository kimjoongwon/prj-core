import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  app.enableCors();

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  fetch;
  await app.listen(3005);
}

bootstrap();
