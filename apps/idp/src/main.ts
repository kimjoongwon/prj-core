import { join } from "node:path";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";
import { AppModule } from "./module/app.module";
import { setNestApp } from "./setNestApp";

async function bootstrap() {
	// =================================================================
	// 1. 애플리케이션 생성 및 기본 설정
	// =================================================================
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
	});

	// 로거 설정
	app.useLogger(app.get(Logger));

	// =================================================================
	// 2. View Engine 설정 (EJS for login/consent pages)
	// =================================================================
	app.setBaseViewsDir(join(__dirname, "src", "views"));
	app.setViewEngine("ejs");

	// =================================================================
	// 3. Express 미들웨어 설정
	// =================================================================
	app.use(cookieParser());
	app.set("query parser", "extended");

	// =================================================================
	// 4. CORS 설정
	// =================================================================
	app.enableCors({
		origin: true,
		credentials: true,
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
		allowedHeaders: "*",
	});

	// =================================================================
	// 5. Global 설정 (Guards, Pipes, Filters, Interceptors)
	// =================================================================
	setNestApp(app);

	// =================================================================
	// 6. API 문서 설정 (Swagger)
	// =================================================================
	const config = new DocumentBuilder()
		.setTitle("OIDC Identity Provider")
		.setVersion("1.0.0")
		.setDescription("OpenID Connect Identity Provider API")
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document);

	// =================================================================
	// 7. 서버 시작
	// =================================================================
	const port = process.env.APP_PORT || 3007;
	await app.listen(port);

	const logger = app.get(Logger);
	logger.log(`🔐 IdP 서버가 ${port} 포트에서 시작되었습니다`);
	logger.log(`📱 환경: ${process.env.NODE_ENV}`);
	logger.log(`📊 API 문서: http://localhost:${port}/api`);
	logger.log(
		`🔑 OIDC Discovery: http://localhost:${port}/oidc/.well-known/openid-configuration`,
	);
}

bootstrap();
