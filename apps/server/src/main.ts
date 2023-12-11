import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, CorsConfig } from './configs/config.type';
import { loggerConfig } from './configs';
import { AllExceptionsFilter } from './common/filters';
import cookieParser from 'cookie-parser';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig());

  const logger = new Logger();
  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfig>('cors');
  const appConfig = configService.get<AppConfig>('app');

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  // Cors
  if (corsConfig.enabled) {
    logger.log(
      corsConfig.enabled ? 'CORS이 적용되었습니다.' : 'CORS STOP',
      'Cors Enabled',
    );
    app.enableCors({
      origin: 'http://localhost:3004',
      credentials: true,
    });
  }

  logger.log(`${appConfig.port} listening..`, 'Server Started');

  await app.listen(appConfig.port);
}

bootstrap();
