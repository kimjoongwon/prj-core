import { Token } from "@cocrepo/constant";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import {
	DocumentBuilder,
	type SwaggerDocumentOptions,
	SwaggerModule,
} from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { Logger } from "nestjs-pino";
import { AppModule } from "./module/app.module";
import { setNestApp } from "./setNestApp";

async function bootstrap() {
	// =================================================================
	// 1. 애플리케이션 생성 및 기본 설정
	// =================================================================
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true, // 로거 설정 전까지 로그 버퍼링
	});

	// 로거 설정 (가장 먼저 설정하여 모든 로그 캐치)
	app.useLogger(app.get(Logger));

	// =================================================================
	// 2. Express 미들웨어 설정 (HTTP 레벨 - 가장 먼저 실행)
	// =================================================================
	// 쿠키 파싱 미들웨어 - 모든 요청에서 쿠키를 자동 파싱
	app.use(cookieParser());

	// Express 쿼리 파서 설정 - 복잡한 쿼리 객체 파싱 지원
	app.set("query parser", "extended");

	// =================================================================
	// 3. CORS 설정 (브라우저 보안 정책 - HTTP 레벨에서 처리)
	// =================================================================
	app.enableCors({
		origin: true, // 모든 도메인 허용 (개발환경용, 프로덕션에서는 특정 도메인 지정 권장)
		credentials: true, // 쿠키, 인증 헤더 포함 허용
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
		allowedHeaders: "*", // 모든 헤더 허용
	});

	// =================================================================
	// 4. Global 설정 (Guards, Pipes, Filters, Interceptors)
	// =================================================================
	setNestApp(app);

	// =================================================================
	// 5. API 문서 설정 (Swagger)
	// =================================================================
	const oidcIssuer = process.env.OIDC_ISSUER || "http://localhost:3007";

	const config = new DocumentBuilder()
		.setTitle(process.env.APP_NAME || "NestJS Application")
		.setVersion("1.0.0")
		.setDescription(
			"API 문서입니다. 대부분의 엔드포인트는 인증이 필요합니다.\n\n" +
				"**인증 방법:**\n" +
				"1. OAuth2 (권장) - Authorize 버튼 클릭 후 OIDC 로그인\n" +
				"2. Cookie - 브라우저에서 로그인 후 쿠키 자동 전송",
		)
		.addCookieAuth(Token.ACCESS, {
			type: "apiKey",
			in: "cookie",
			name: Token.ACCESS,
			description: "JWT Access Token (HttpOnly 쿠키로 자동 전송)",
		})
		.addOAuth2({
			type: "oauth2",
			description: "OIDC Authorization Code + PKCE 인증",
			flows: {
				authorizationCode: {
					authorizationUrl: `${oidcIssuer}/oidc/auth`,
					tokenUrl: `${oidcIssuer}/oidc/token`,
					scopes: {
						openid: "OpenID Connect 기본 인증",
						profile: "프로필 정보 (이름)",
						email: "이메일 주소",
						roles: "역할 및 Space 정보",
					},
				},
			},
		})
		.build();

	const options: SwaggerDocumentOptions = {
		operationIdFactory: (_controllerKey: string, methodKey: string) =>
			methodKey, // API 작업 ID를 메소드명으로 설정
	};

	const document = SwaggerModule.createDocument(app, config, options);

	const port = process.env.APP_PORT || 3006;

	SwaggerModule.setup("api", app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			oauth2RedirectUrl: `http://localhost:${port}/api/oauth2-redirect.html`,
			initOAuth: {
				clientId: "prj-core-swagger",
				scopes: ["openid", "profile", "email", "roles"],
				usePkceWithAuthorizationCodeGrant: true,
			},
		},
	});

	// =================================================================
	// 6. 서버 시작 및 로깅
	// =================================================================
	await app.listen(port);

	const logger = app.get(Logger);
	logger.log(`🚀 서버가 ${port} 포트에서 시작되었습니다`);
	logger.log(`📱 환경: ${process.env.NODE_ENV}`);
	logger.log(`🐳 Docker: ${process.env.DOCKER_ENV === "true" ? "Yes" : "No"}`);
	logger.log(`📊 API 문서: http://localhost:${port}/api`);
}

bootstrap();
