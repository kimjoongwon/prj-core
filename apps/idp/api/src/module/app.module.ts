import { SpaceContext } from "@cocrepo/context";
import { SpaceAggregate } from "@cocrepo/aggregate";
import {
	AuthMiddleware,
	DtoTransformInterceptor,
	LoggerMiddleware,
	RequestContextMiddleware,
	ResponseEntityInterceptor,
	SpaceAccessGuard,
	SpaceScopeInterceptor,
} from "@cocrepo/be-common";
import { SpacesRepository } from "@cocrepo/repository";
import { I18nModule } from "@cocrepo/service";
import {
	Logger,
	type MiddlewareConsumer,
	Module,
	NestModule,
	type OnModuleInit,
} from "@nestjs/common";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthModule } from "./auth";
import { EmailVerificationsModule } from "./email-verification";
import { globalModules } from "./global.module";
import { I18nCatalogModule } from "./i18n";
import { InteractionModule } from "./interaction/interaction.module";
import { OidcModule } from "./oidc/oidc.module";
import { PasswordResetModule } from "./password-reset/password-reset.module";
import { PrismaModule } from "./prisma.module";
import { RedisModule } from "./redis.module";
import { SecurityPolicyModule } from "./security-policy";

const enableNestDevtools =
	process.env.ENABLE_NEST_DEVTOOLS === "true" &&
	process.env.NODE_ENV !== "production";

@Module({
	imports: [
		...globalModules,
		DevtoolsModule.register({
			http: enableNestDevtools,
			port:
				Number.parseInt(process.env.IDP_API_NEST_DEVTOOLS_PORT ?? "8001", 10) ||
				8001,
		}),
		PrismaModule,
		RedisModule,
		I18nModule,
		// 기존 IdP 모듈
		I18nCatalogModule,
		OidcModule,
		InteractionModule,
		PasswordResetModule,
		// server에서 이동된 모듈
		AuthModule,
		EmailVerificationsModule,
		SecurityPolicyModule,
		RouterModule.register([
			{
				path: "api",
				children: [
					{
						path: "v1",
						children: [
							{
								path: "i18n",
								module: I18nCatalogModule,
							},
							{
								path: "auth",
								module: AuthModule,
							},
							{
								path: "idp/security-policy",
								module: SecurityPolicyModule,
							},
							{
								path: "idp/email-verifications",
								module: EmailVerificationsModule,
							},
						],
					},
				],
			},
		]),
	],
	providers: [
		// Space 도메인 (RequestContextMiddleware 의존)
		SpacesRepository,
		SpaceAggregate,
		// Guards (setNestApp에서 순서대로 등록됨)
		SpaceAccessGuard,
		// Middleware (DI 주입 필요)
		RequestContextMiddleware,
		// Interceptors (setNestApp에서 순서대로 등록됨)
		SpaceScopeInterceptor,
		DtoTransformInterceptor,
		ResponseEntityInterceptor,
		// Space Context (Service에서 주입)
		SpaceContext,
		// Rate Limiting
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule implements NestModule, OnModuleInit {
	private readonly logger = new Logger(AppModule.name);

	async onModuleInit() {
		this.logger.log("IDP_APP_MODULE INITIALIZED");
	}

	configure(consumer: MiddlewareConsumer) {
		// /api/v1/* 경로에만 인증/컨텍스트/로거 미들웨어 적용
		// OIDC 경로 (/oidc/*, /api/interaction/*, /api/password-*) 는 제외
		consumer
			.apply(AuthMiddleware, RequestContextMiddleware, LoggerMiddleware)
			.forRoutes("api/v1/*path");
	}
}
