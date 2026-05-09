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
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AbilitiesModule } from "./abilities";
import { ActionsModule } from "./actions";
import { AssetsModule } from "./assets";
import { CategoriesModule } from "./categories";
import { CoursesModule } from "./courses";
// Global modules
import { FoldersModule } from "./folders";
import { globalModules } from "./global.module";
import { GroupsModule } from "./groups";
import { I18nCatalogModule } from "./i18n";
import { InquiriesModule } from "./inquiries";
import { PoliciesModule } from "./policies";
import { PolicyAssignmentsModule } from "./policy-assignments";
import { PrismaModule } from "./prisma.module";
import { RedisModule } from "./redis.module";
import { ReservationsModule } from "./reservations";
import { RolesModule } from "./roles";
import { RoutinesModule } from "./routines";
import { ServiceDocumentsModule } from "./service-documents";
import { SpacesModule } from "./spaces";
import { SubjectsModule } from "./subjects";
import { TasksModule } from "./tasks";
import { TemplatesModule } from "./templates";
import { TenantAccessRequestsModule } from "./tenant-access-requests";
import { TimelinesModule } from "./timelines";
import { TranslationsModule } from "./translations";
import { UsersModule } from "./users";

const enableNestDevtools =
	process.env.ENABLE_NEST_DEVTOOLS === "true" &&
	process.env.NODE_ENV !== "production" &&
	process.env.NODE_ENV !== "test";

const devtoolsImports = enableNestDevtools
	? [
			DevtoolsModule.register({
				http: true,
				port:
					Number.parseInt(
						process.env.CORE_API_NEST_DEVTOOLS_PORT ?? "8000",
						10,
					) || 8000,
			}),
		]
	: [];

@Module({
	imports: [
		...globalModules,
		...devtoolsImports,
		PrismaModule,
		RedisModule,
		I18nModule,
		SpacesModule,
		UsersModule,
		ActionsModule,
		AssetsModule,
		SubjectsModule,
		AbilitiesModule,
		RolesModule,
		GroupsModule,
		I18nCatalogModule,
		CategoriesModule,
		PoliciesModule,
		PolicyAssignmentsModule,
		FoldersModule,
		TemplatesModule,
		ServiceDocumentsModule,
		TranslationsModule,
		CoursesModule,
		TimelinesModule,
		TasksModule,
		RoutinesModule,
		InquiriesModule,
		TenantAccessRequestsModule,
		ReservationsModule,
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
								path: "assets",
								module: AssetsModule,
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
								path: "i18n",
								module: I18nCatalogModule,
							},
							{
								path: "categories",
								module: CategoriesModule,
							},
							{
								path: "policies",
								module: PoliciesModule,
							},
							{
								path: "policy-assignments",
								module: PolicyAssignmentsModule,
							},
							{
								path: "folders",
								module: FoldersModule,
							},
							{
								path: "templates",
								module: TemplatesModule,
							},
							{
								path: "service-documents",
								module: ServiceDocumentsModule,
							},
							{
								path: "translations",
								module: TranslationsModule,
							},
							{
								path: "courses",
								module: CoursesModule,
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
							{
								path: "tenant-access-requests",
								module: TenantAccessRequestsModule,
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
