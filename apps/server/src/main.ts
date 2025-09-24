import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import {
	DocumentBuilder,
	SwaggerDocumentOptions,
	SwaggerModule,
} from "@nestjs/swagger";
import { AllExceptionsFilter, PrismaClientExceptionFilter } from "@shared";
import cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";
import { AppModule } from "./module/app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
	});

	const httpAdapterHost = app.get(HttpAdapterHost);

	app.useLogger(app.get(Logger));

	// Cookie parser 미들웨어 추가
	app.use(cookieParser());
	app.set("query parser", "extended");
	app.useGlobalFilters(
		new AllExceptionsFilter(httpAdapterHost.httpAdapter),
		new PrismaClientExceptionFilter(httpAdapterHost.httpAdapter),
	);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true, // DTO에 정의되지 않은 속성 자동 제거
		}),
	);

	const config = new DocumentBuilder()
		.setTitle(process.env.APP_NAME || "NestJS Application")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (_controllerKey: string, methodKey: string) =>
			methodKey,
	};

	const document = SwaggerModule.createDocument(app, config, options);
	SwaggerModule.setup("api", app, document);

	app.enableCors({
		origin: true, // 모든 도메인 허용
		credentials: true,
		methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		allowedHeaders: '*',
	});

	const port = process.env.APP_PORT || 3006;
	await app.listen(port);

	const logger = app.get(Logger);
	logger.log(`🚀 서버가 ${port} 포트에서 시작되었습니다`);
	logger.log(`📱 환경: ${process.env.NODE_ENV}`);
	logger.log(`🐳 Docker: ${process.env.DOCKER_ENV === "true" ? "Yes" : "No"}`);
	logger.log(`📊 API 문서: http://localhost:${port}/api`);
	logger.log(`📊 API 문서: http://localhost:${port}/api`);
}

bootstrap();
