// NestJS core imports

// be-common imports
import {
	LoggerMiddleware,
	RequestContextInterceptor,
	ResponseEntityInterceptor,
} from "@cocrepo/be-common";
import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import type { PrismaClient } from "@cocrepo/prisma";
import { ConstantSyncService, SubjectSyncService } from "@cocrepo/service";
import {
	Inject,
	Logger,
	type MiddlewareConsumer,
	Module,
	type OnModuleInit,
} from "@nestjs/common";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ThrottlerGuard } from "@nestjs/throttler";
import { AbilitiesModule } from "./abilities";
import { AuthModule } from "./auth";
// Global modules
import { globalModules } from "./global.module";
import { GroundsModule } from "./grounds";
import { PrismaModule } from "./prisma.module";
import { SubjectsModule } from "./subjects";
import { UIConfigModule } from "./ui-config";
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
		UIConfigModule,
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
								path: "ui-configs",
								module: UIConfigModule,
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
	private readonly logger = new Logger(AppModule.name);
	private readonly LOG_PREFIX = `${AppModule.name} INIT`;

	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prismaClient: PrismaClient,
		private readonly subjectSyncService: SubjectSyncService,
		private readonly constantSyncService: ConstantSyncService,
	) {}

	async onModuleInit() {
		this.logger.log(`[${this.LOG_PREFIX}] APP_MODULE INITIALIZED`);

		// Subject 동기화
		await this.syncAllSubjects();
	}

	/**
	 * 모든 Subject를 동기화합니다.
	 *
	 * 1. Entity/Column Subject: Prisma 스키마의 @displayName 주석에서 동기화
	 * 2. Menu/Feature Subject: @cocrepo/constant의 상수에서 동기화
	 */
	private async syncAllSubjects(): Promise<void> {
		try {
			const systemTenantId = await this.getSystemTenantId();
			if (!systemTenantId) {
				this.logger.warn(
					"시스템 테넌트를 찾을 수 없어 Subject 동기화를 건너뜁니다.",
				);
				return;
			}

			// 1. Entity/Column Subject 동기화 (Prisma 스키마)
			const schemaResult =
				await this.subjectSyncService.syncFromSchema(systemTenantId);
			this.logger.log(
				`[Schema] Subject 동기화: 생성=${schemaResult.created}, 업데이트=${schemaResult.updated}, 스킵=${schemaResult.skipped}`,
			);

			// 2. Menu/Feature Subject 동기화 (Constant)
			const constantResult =
				await this.constantSyncService.syncFromConstant(systemTenantId);
			this.logger.log(
				`[Constant] Subject 동기화: 생성=${constantResult.created}, 업데이트=${constantResult.updated}, 스킵=${constantResult.skipped}`,
			);
		} catch (error) {
			this.logger.error(
				`Subject 동기화 실패: ${error instanceof Error ? error.message : String(error)}`,
			);
			if (error instanceof Error && error.stack) {
				this.logger.error(error.stack);
			}
			// 동기화 실패가 앱 시작을 막지 않도록 에러를 던지지 않음
		}
	}

	/**
	 * 시스템 테넌트 ID를 조회합니다.
	 * 첫 번째 테넌트의 ID를 반환합니다.
	 */
	private async getSystemTenantId(): Promise<string | null> {
		const tenant = await this.prismaClient.tenant.findFirst({
			where: { removedAt: null },
			orderBy: { createdAt: "asc" },
		});
		return tenant?.id ?? null;
	}

	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
