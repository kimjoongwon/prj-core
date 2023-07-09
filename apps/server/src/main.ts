import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter, PrismaService } from 'nestjs-prisma';
import { AppConfig, CorsConfig } from './configs/config.type';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 유효성 검사 파이프(class-validator, class-transformer)
  app.useGlobalPipes(new ValidationPipe());

  // prismaService.enableShutdownHooks(app)을 사용하면 앱이 종료될 때 prismaClient를 종료합니다.
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  const configService = app.get(ConfigService);
  // cors 설정
  const corsConfig = configService.get<CorsConfig>('cors');
  const appConfig = configService.get<AppConfig>('app');

  // prismaClient 예외 필터
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(
    new PrismaClientExceptionFilter(httpAdapter.getHttpServer()),
  );

  // HMR
  if (module.hot) {
    console.info('---------HMR Enabled!-----------');
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // Cors
  if (corsConfig.enabled) {
    console.info('---------Cors Enabled!----------');
    app.enableCors();
  }

  await app.listen(appConfig.port);
}

bootstrap();
