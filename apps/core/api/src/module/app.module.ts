// NestJS core imports

import {
	AuthMiddleware,
	BigIntResponseInterceptor,
	DtoTransformInterceptor,
	JwtStrategy,
	LoggerMiddleware,
	RequestContextMiddleware,
	ResponseEntityInterceptor,
	SpaceAccessGuard,
	SpaceScopeInterceptor,
} from "@cocrepo/be-common";
// be-common imports
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { SpacesRepository } from "@cocrepo/repository";
import {
	AuthCacheService,
	I18nModule,
	TokenStorageService,
} from "@cocrepo/service";
import {
	Logger,
	type MiddlewareConsumer,
	Module,
	type OnModuleInit,
} from "@nestjs/common";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AbilitiesModule } from "./abilities";
import { AssetsModule } from "./assets";
import { CommunityModule } from "./community";
import {
	isNestDevtoolsEnabled,
	loadNestDevtoolsModule,
} from "./devtools.module";
// Global modules
import { FoldersModule } from "./folders";
import { globalModules } from "./global.module";
import { I18nCatalogModule } from "./i18n";
import { PasswordResetModule } from "./password-reset";
import { PoliciesModule } from "./policies";
import { PrismaModule } from "./prisma.module";
import { RedisModule } from "./redis.module";
import { ReservationsModule } from "./reservations";
import { RoleAssignmentsModule } from "./role-assignments";
import { RolesModule } from "./roles";
import { UsersModule } from "./users";

const devtoolsImports = isNestDevtoolsEnabled()
	? [loadNestDevtoolsModule()]
	: [];

@Module({
	imports: [
		...globalModules,
		...devtoolsImports,
		PrismaModule,
		RedisModule,
		I18nModule,
		UsersModule,
		AssetsModule,
		AbilitiesModule,
		RolesModule,
		I18nCatalogModule,
		CommunityModule,
		PoliciesModule,
		RoleAssignmentsModule,
		FoldersModule,
		ReservationsModule,
		// 발급자(OIDC provider·interaction·auth)는 idp-api가 소유한다 — core-api는
		// 비밀번호 재설정과 토큰 검증(JwtStrategy·JWKS)만 담당한다.
		PasswordResetModule,
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
								path: "users",
								module: UsersModule,
							},
							{
								path: "assets",
								module: AssetsModule,
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
								path: "i18n",
								module: I18nCatalogModule,
							},
							{
								path: "community",
								module: CommunityModule,
							},
							{
								path: "policies",
								module: PoliciesModule,
							},
							{
								path: "roles",
								module: RoleAssignmentsModule,
							},
							{
								path: "folders",
								module: FoldersModule,
							},
							{
								path: "reservations",
								module: ReservationsModule,
							},
							// 새로운 Resource 라우트는 여기에 추가
						],
					},
				],
			},
		]),
	],
	providers: [
		// JWT 인증 (passport "jwt" 전략 등록)
		JwtStrategy,
		AuthCacheService,
		// Token (setNestApp의 JwtAuthGuard 의존)
		TokenStorageService,
		// Guards (setNestApp에서 순서대로 등록됨)
		SpaceAccessGuard,
		// Interceptors (setNestApp에서 순서대로 등록됨)
		SpacesRepository,
		BigIntResponseInterceptor,
		SpaceScopeInterceptor,
		DtoTransformInterceptor,
		ResponseEntityInterceptor,
		// Context (Service에서 주입)
		AuthContext,
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
			.forRoutes("api/v1/*path");
	}
}
