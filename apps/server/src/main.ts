import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig, CorsConfig } from './configs/config.type';
import { WinstonModule, utilities } from 'nest-winston';
import winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          format: winston.format.combine(
            // winston.format.prettyPrint(),
            winston.format.splat(),
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike('COC LOGGER', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    }),
  });

  // 유효성 검사 파이프(class-validator, class-transformer)
  const configService = app.get(ConfigService);
  // cors 설정
  const corsConfig = configService.get<CorsConfig>('cors');
  const appConfig = configService.get<AppConfig>('app');

  app.useGlobalPipes(new ValidationPipe());

  // // HMR
  // if (module.hot) {
  //   console.info('---------HMR Enabled!-----------');
  //   module.hot.accept();
  //   module.hot.dispose(() => app.close());
  // }

  // Cors
  if (corsConfig.enabled) {
    console.info('---------Cors Enabled!----------');
    app.enableCors({
      origin: '*',
      credentials: true,
    });
  }

  console.info(appConfig.port, 'running');
  await app.listen(appConfig.port);
}

bootstrap();
