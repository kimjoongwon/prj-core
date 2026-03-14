import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

function getConnectionTarget(connectionString: string): string {
	try {
		const url = new URL(connectionString);
		return `${url.hostname}:${url.port || "5432"}`;
	} catch {
		return "unknown";
	}
}

/**
 * OIDC용 Direct Prisma Provider
 *
 * RLS(Row Level Security)를 우회하기 위해 DIRECT_URL로 연결하는 별도의 PrismaClient를 관리합니다.
 * OIDC 토큰/세션/클라이언트 저장은 tenant 컨텍스트 없이 접근해야 하므로
 * 전역 PrismaModule과 별도로 운영됩니다.
 *
 * OidcClientRepository와 PrismaOidcAdapterFactory가 공유합니다.
 */
@Injectable()
export class DirectPrismaProvider implements OnModuleDestroy {
	private readonly logger = new Logger(DirectPrismaProvider.name);
	private prisma: PrismaClient | null = null;
	private pool: pg.Pool | null = null;

	constructor(private readonly configService: ConfigService) {}

	async getClient(): Promise<PrismaClient> {
		if (this.prisma) return this.prisma;

		const directUrl = this.configService.get<string>("DIRECT_URL");
		const databaseUrl = this.configService.get<string>("DATABASE_URL");
		const connectionUrl = directUrl || databaseUrl;

		if (!connectionUrl) {
			throw new Error("DATABASE_URL or DIRECT_URL is not defined");
		}

		this.logger.debug(
			`OIDC Direct Prisma 클라이언트 생성 (directUrl: ${directUrl ? "사용" : "미사용"})`,
		);
		this.logger.log(
			`OIDC Direct Prisma 연결 대상 확인 (${getConnectionTarget(connectionUrl)})`,
		);

		this.pool = new pg.Pool({
			connectionString: connectionUrl,
			max: 10,
			idleTimeoutMillis: 30000,
		});

		const adapter = new PrismaPg(this.pool);

		try {
			this.prisma = new PrismaClient({ adapter });
			await this.prisma.$connect();
			return this.prisma;
		} catch (error) {
			this.prisma = null;
			if (this.pool) {
				await this.pool.end().catch(() => undefined);
				this.pool = null;
			}
			this.logger.error("OIDC Direct Prisma 연결 실패", error);
			throw error;
		}
	}

	async onModuleDestroy() {
		if (this.prisma) {
			await this.prisma.$disconnect();
		}
		if (this.pool) {
			await this.pool.end();
		}
	}
}
