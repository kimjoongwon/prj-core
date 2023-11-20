import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, CorsConfig } from './configs/config.type';
import { loggerConfig } from './configs';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, loggerConfig());
  const logger = new Logger();

  const configService = app.get(ConfigService);
  const corsConfig = configService.get<CorsConfig>('cors');
  const appConfig = configService.get<AppConfig>('app');

  app.useGlobalPipes(new ValidationPipe());
  // HMR
  if (module.hot) {
    logger.log(
      module.hot ? 'HMR이 적용되었습니다.' : 'Stop HMR',
      'HMR Enabled',
    );
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  // Cors
  if (corsConfig.enabled) {
    logger.log(
      corsConfig.enabled ? 'CORS이 적용되었습니다.' : 'CORS STOP',
      'Cors Enabled',
    );
    app.enableCors({
      origin: '*',
      credentials: true,
    });
  }

  logger.log(`${appConfig.port} listening..`, 'Server Started');
  await app.listen(appConfig.port);
}

bootstrap();
