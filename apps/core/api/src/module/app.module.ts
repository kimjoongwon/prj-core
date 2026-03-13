// NestJS core imports

// be-common imports
import {
	AuthMiddleware,
	DtoTransformInterceptor,
	LoggerMiddleware,
	RequestContextMiddleware,
	ResponseEntityInterceptor,
	SpaceAccessGuard,
	SpaceScopeInterceptor,
} from "@cocrepo/be-common";
import {
	AuthCacheService,
	AuthContext,
	I18nModule,
	JwtStrategy,
	SpaceContext,
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
import { ActionsModule } from "./actions";
import { CategoriesModule } from "./categories";
// Global modules
import { globalModules } from "./global.module";
import { GrantsModule } from "./grants";
import { GroupsModule } from "./groups";
import { InquiriesModule } from "./inquiries";
import { PrismaModule } from "./prisma.module";
import { RedisModule } from "./redis.module";
import { RolesModule } from "./roles";
import { RoutinesModule } from "./routines";
import { SpacesModule } from "./spaces";
import { SubjectsModule } from "./subjects";
import { TasksModule } from "./tasks";
import { TemplatesModule } from "./templates";
import { TimelinesModule } from "./timelines";
import { UsersModule } from "./users";

@Module({
	imports: [
		...globalModules,
		PrismaModule,
		RedisModule,
		I18nModule,
		SpacesModule,
		UsersModule,
		ActionsModule,
		SubjectsModule,
		AbilitiesModule,
		RolesModule,
		GroupsModule,
		CategoriesModule,
		GrantsModule,
		TemplatesModule,
		TimelinesModule,
		TasksModule,
		RoutinesModule,
		InquiriesModule,
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
								path: "spaces",
								module: SpacesModule,
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
								path: "templates",
								module: TemplatesModule,
							},
							{
								path: "timelines",
								module: TimelinesModule,
							},
							{
								path: "tasks",
								module: TasksModule,
							},
							{
								path: "routines",
								module: RoutinesModule,
							},
							{
								path: "inquiries",
								module: InquiriesModule,
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
			.forRoutes("*");
	}
}
