// NestJS core imports

// be-common imports
import {
	AuthMiddleware,
	DtoTransformInterceptor,
	LoggerMiddleware,
	RequestContextMiddleware,
	ResponseEntityInterceptor,
	SpaceAccessGuard,
	SpaceContext,
	SpaceScopeInterceptor,
} from "@cocrepo/be-common";
import { I18nModule } from "@cocrepo/be-i18n";
import { SpacesRepository } from "@cocrepo/repository";
import { SpacesService } from "@cocrepo/service";
import {
	Logger,
	type MiddlewareConsumer,
	Module,
	type OnModuleInit,
} from "@nestjs/common";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AbilitiesModule } from "./ability";
import { ActionsModule } from "./action";
import { AuthModule } from "./auth";
// Global modules
import { globalModules } from "./global.module";
import { GroundsModule } from "./grounds";
import { PrismaModule } from "./prisma.module";
import { RedisModule } from "./redis.module";
import { RolesModule } from "./role";
import { SubjectsModule } from "./subject";
import { OidcClientsModule } from "./oidc-client";
import { OidcSessionsModule } from "./oidc-session";
import { TranslationsModule } from "./translation";
import { UsersModule } from "./users";

@Module({
	imports: [
		...globalModules,
		PrismaModule,
		RedisModule,
		I18nModule,
		AuthModule,
		GroundsModule,
		UsersModule,
		ActionsModule,
		SubjectsModule,
		AbilitiesModule,
		RolesModule,
		TranslationsModule,
		OidcClientsModule,
		OidcSessionsModule,
		// Resource Modules는 필요할 때 추가합니다.
		// 가이드: .claude/agents/be-controller-builder.md
		RouterModule.register([
			{
				path: "api",
				children: [
					{
						path: "v1",
						children: [
							{
								path: "auth",
								module: AuthModule,
							},
							{
								path: "grounds",
								module: GroundsModule,
							},
							{
								path: "users",
								module: UsersModule,
							},
							{
								path: "actions",
								module: ActionsModule,
							},
							{
								path: "subjects",
								module: SubjectsModule,
							},
							{
								path: "abilities",
								module: AbilitiesModule,
							},
							{
								path: "roles",
								module: RolesModule,
							},
							{
								path: "translations",
								module: TranslationsModule,
							},
							{
								path: "oidc-clients",
								module: OidcClientsModule,
							},
							{
								path: "oidc-sessions",
								module: OidcSessionsModule,
							},
							// 새로운 Resource 라우트는 여기에 추가
						],
					},
				],
			},
		]),
	],
	providers: [
		// Space 도메인 (RequestContextMiddleware 의존)
		SpacesRepository,
		SpacesService,
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
export class AppModule implements OnModuleInit {
	private readonly logger = new Logger(AppModule.name);
	private readonly LOG_PREFIX = `${AppModule.name} INIT`;

	async onModuleInit() {
		this.logger.log(`[${this.LOG_PREFIX}] APP_MODULE INITIALIZED`);
	}

	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware, RequestContextMiddleware, LoggerMiddleware)
			.forRoutes("*");
	}
}
