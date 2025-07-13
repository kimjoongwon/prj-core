import { Logger as NestLogger, ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger";

import cookieParser = require("cookie-parser");

import { AppModule } from "./module/app.module";
import { AllExceptionsFilter, logConfig, PrismaClientExceptionFilter } from "./shared";

async function bootstrap() {
  const startTime = Date.now();
  const logger = new NestLogger("Bootstrap");

  logger.log("🚀 Starting server...");

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    logger: logConfig.level,
  });
  const httpAdapterHost = app.get(HttpAdapterHost);

  // Cookie parser 미들웨어 추가
  app.use(cookieParser());

  // app.useLogger(app.get(Logger));
  app.set("query parser", "extended");
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapterHost.httpAdapter),
    new PrismaClientExceptionFilter(httpAdapterHost.httpAdapter),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true, // DTO에 정의되지 않은 속성 자동 제거
      // forbidNonWhitelisted: true,
      // whitelist: true, // DTO에 정의되지 않은 속성 자동 제거
      // transformOptions: {
      //   excludeExtraneousValues: true, // class-transformer에서 @Expose()가 없는 속성 제거
      // },
    }),
  );
  const config = new DocumentBuilder().setVersion("1.0.0").addBearerAuth().build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  };

  // @ts-ignore
  const document = SwaggerModule.createDocument(app, config, options);

  // @ts-ignore
  SwaggerModule.setup("api", app, document);

  app.enableCors({
    origin: [
      "http://localhost:4173",
      "http://localhost:3004",
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://10.0.2.2:8082",
      "http://localhost:8081",
      "http://localhost:8082",
      "http://192.168.233.197:3005",
      "http://192.168.233.197:5173",
      "http://192.168.233.197",
      "http://localhost",
      "https://wallyops.com",
    ],
    credentials: true,
  });

  const port = 3005;
  await app.listen(port);

  const _bootTime = Date.now() - startTime;
  logger.log("🎉 Server started successfully!");
}

bootstrap();
