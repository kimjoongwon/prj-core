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

type HmrModule = {
	hot?: {
		accept: () => void;
		dispose: (callback: (data: unknown) => Promise<void> | void) => void;
	};
};

declare const module: HmrModule;

async function bootstrap() {
	const enableNestDevtools =
		process.env.ENABLE_NEST_DEVTOOLS === "true" &&
		process.env.NODE_ENV !== "production";

	// =================================================================
	// 1. 애플리케이션 생성 및 기본 설정
	// =================================================================
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bufferLogs: true,
		snapshot: enableNestDevtools,
	});

	// 로거 설정
	app.useLogger(app.get(Logger));

	// =================================================================
	// 2. Express 미들웨어 설정
	// =================================================================
	app.use(cookieParser());
	app.set("query parser", "extended");

	// =================================================================
	// 3. CORS 설정
	// =================================================================
	app.enableCors({
		origin: true,
		credentials: true,
		methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
		allowedHeaders: "*",
	});

	// =================================================================
	// 4. Global 설정 (Guards, Pipes, Filters, Interceptors)
	// =================================================================
	setNestApp(app);

	// =================================================================
	// 5. API 문서 설정 (Swagger)
	// =================================================================
	const oidcIssuer = process.env.OIDC_ISSUER || "http://localhost:3007";
	const swaggerBaseUrl = process.env.IDP_CLIENT_URL || oidcIssuer;

	const config = new DocumentBuilder()
		.setTitle("OIDC Identity Provider")
		.setVersion("1.0.0")
		.setDescription(
			"OpenID Connect Identity Provider API\n\n" +
				"OIDC 인증 및 IDP 관리 API를 제공합니다.\n\n" +
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
			methodKey,
	};

	const document = SwaggerModule.createDocument(app, config, options);

	const port = process.env.APP_PORT || 3007;

	SwaggerModule.setup("api", app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			oauth2RedirectUrl: `${swaggerBaseUrl}/api/oauth2-redirect.html`,
			initOAuth: {
				clientId: "swagger-web",
				scopes: ["openid", "profile", "email", "roles"],
				usePkceWithAuthorizationCodeGrant: true,
			},
		},
	});

	// =================================================================
	// 6. 서버 시작
	// =================================================================
	await app.listen(port);

	const logger = app.get(Logger);
	logger.log(`🔐 IdP 서버가 ${port} 포트에서 시작되었습니다`);
	logger.log(`📱 환경: ${process.env.NODE_ENV}`);
	logger.log(`📊 API 문서: http://localhost:${port}/api`);
	logger.log(
		`🔑 OIDC Discovery: http://localhost:${port}/oidc/.well-known/openid-configuration`,
	);
	if (enableNestDevtools) {
		const devtoolsPort =
			Number.parseInt(process.env.IDP_API_NEST_DEVTOOLS_PORT ?? "8001", 10) ||
			8001;
		logger.log(`🕸️ Nest Devtools: http://localhost:${devtoolsPort}`);
	}

	return app;
}

bootstrap().then((app) => {
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
});
