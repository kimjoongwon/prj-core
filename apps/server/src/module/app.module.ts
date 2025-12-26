// NestJS core imports

// be-common imports
import {
	LoggerMiddleware,
	RequestContextInterceptor,
	ResponseEntityInterceptor,
} from "@cocrepo/be-common";
import {
	Logger,
	MiddlewareConsumer,
	Module,
	OnModuleInit,
} from "@nestjs/common";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AuthModule } from "./auth";
// Global modules
import { globalModules } from "./global.module";
import { GroundsModule } from "./ground";
import { PrismaModule } from "./prisma.module";

@Module({
	imports: [
		...globalModules,
		PrismaModule,
		AuthModule,
		GroundsModule,
		// Resource Modules는 필요할 때 추가합니다.
		// 가이드: .claude/agents/controller-builder.md
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
