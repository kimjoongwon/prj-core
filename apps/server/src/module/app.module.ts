// NestJS core imports
import {
	Logger,
	MiddlewareConsumer,
	Module,
	OnModuleInit,
} from "@nestjs/common";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
// Shared imports
import { LoggerMiddleware, RequestContextInterceptor } from "@shared";
import { ResponseEntityInterceptor } from "../shared/interceptor/response-entity.interceptor";
import { AuthModule } from "./auth.module";
// Global modules
import { globalModules } from "./global.module";
import { PrismaModule } from "./prisma.module";

@Module({
	imports: [
		...globalModules,
		PrismaModule,
		AuthModule,
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
