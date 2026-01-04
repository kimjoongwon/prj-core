// NestJS core imports

// be-common imports
import {
	LoggerMiddleware,
	RequestContextInterceptor,
	ResponseEntityInterceptor,
} from "@cocrepo/be-common";
import {
	Logger,
	type MiddlewareConsumer,
	Module,
	type OnModuleInit,
} from "@nestjs/common";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AbilitiesModule } from "./abilities";
import { AuthModule } from "./auth";
import { ColumnsModule } from "./columns";
// Global modules
import { globalModules } from "./global.module";
import { GroundsModule } from "./grounds";
import { PrismaModule } from "./prisma.module";
import { SubjectsModule } from "./subjects";
import { UsersModule } from "./users";

@Module({
	imports: [
		...globalModules,
		PrismaModule,
		AuthModule,
		GroundsModule,
		UsersModule,
		AbilitiesModule,
		SubjectsModule,
		ColumnsModule,
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
								path: "abilities",
								module: AbilitiesModule,
							},
							{
								path: "subjects",
								module: SubjectsModule,
							},
							{
								path: "columns",
								module: ColumnsModule,
							},
							// 새로운 Resource 라우트는 여기에 추가
						],
					},
				],
			},
		]),
	],
	providers: [
		RequestContextInterceptor,
		ResponseEntityInterceptor,
		// Rate Limiting
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule implements OnModuleInit {
	logger = new Logger(AppModule.name);
	LOG_PREFIX = `${AppModule.name} INIT`;

	async onModuleInit() {
		this.logger.log(`[${this.LOG_PREFIX}] APP_MODULE INITIALIZED`);
	}

	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
