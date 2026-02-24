// NestJS core imports

// be-common imports
import {
	AuthMiddleware,
	DtoTransformInterceptor,
	JwtStrategy,
	LoggerMiddleware,
	RequestContextMiddleware,
	ResponseEntityInterceptor,
	SpaceAccessGuard,
	SpaceScopeInterceptor,
} from "@cocrepo/be-common";
import {
	AuthCacheService,
	I18nModule,
	SpaceContext,
	TokenStorageService,
} from "@cocrepo/service";
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
import { AbilitiesModule } from "./abilities";
import { ActionsModule } from "./actions";
import { AssetsModule } from "./assets";
import { CategoriesModule } from "./categories";
// Global modules
import { globalModules } from "./global.module";
import { ExercisesModule } from "./exercises";
import { GrantsModule } from "./grants";
import { GroupsModule } from "./groups";
import { GroundsModule } from "./grounds";
import { PrismaModule } from "./prisma.module";
import { RedisModule } from "./redis.module";
import { RolesModule } from "./roles";
import { RoutinesModule } from "./routines";
import { SubjectsModule } from "./subjects";
import { TemplatesModule } from "./templates";
import { TimelinesModule } from "./timelines";
import { TranslationsModule } from "./translations";
import { UsersModule } from "./users";

@Module({
	imports: [
		...globalModules,
		PrismaModule,
		RedisModule,
		I18nModule,
		GroundsModule,
		UsersModule,
		ActionsModule,
		SubjectsModule,
		AbilitiesModule,
		RolesModule,
		GroupsModule,
		CategoriesModule,
		GrantsModule,
		TranslationsModule,
		TemplatesModule,
		TimelinesModule,
		ExercisesModule,
		RoutinesModule,
		AssetsModule,
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
								path: "groups",
								module: GroupsModule,
							},
							{
								path: "categories",
								module: CategoriesModule,
							},
							{
								path: "grants",
								module: GrantsModule,
							},
							{
								path: "translations",
								module: TranslationsModule,
							},
							{
								path: "templates",
								module: TemplatesModule,
							},
							{
								path: "timelines",
								module: TimelinesModule,
							},
							{
								path: "exercises",
								module: ExercisesModule,
							},
							{
								path: "routines",
								module: RoutinesModule,
							},
							{
								path: "assets",
								module: AssetsModule,
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
		// Space 도메인 (RequestContextMiddleware 의존)
		SpacesRepository,
		SpacesService,
		// Token (setNestApp의 JwtAuthGuard 의존)
		TokenStorageService,
		// Guards (setNestApp에서 순서대로 등록)
		SpaceAccessGuard,
		// Middleware (DI 주입 필요)
		RequestContextMiddleware,
		// Interceptors (setNestApp에서 순차적으로 등록)
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
