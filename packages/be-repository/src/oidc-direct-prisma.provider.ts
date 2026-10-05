import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { getOidcDirectPrismaConnectionTarget } from "./oidc-direct-prisma-connection-target";

/**
 * OIDC용 Direct Prisma Provider
 *
 * RLS(Row Level Security)를 우회하기 위해 DIRECT_URL로 연결하는 별도의 PrismaClient를 관리합니다.
 * OIDC 토큰/세션/클라이언트 저장은 tenant 컨텍스트 없이 접근해야 하므로
 * 전역 PrismaModule과 별도로 운영됩니다.
 *
 * OidcRuntimeClientsRepository와 OIDC runtime service가 공유합니다.
 */
@Injectable()
export class OidcDirectPrismaProvider implements OnModuleDestroy {
	private readonly logger = new Logger(OidcDirectPrismaProvider.name);
	private prisma: PrismaClient | null = null;
	private pool: pg.Pool | null = null;

	constructor(private readonly configService: ConfigService) {}

	async getClient(): Promise<PrismaClient> {
		if (this.prisma) return this.prisma;

		const directUrl = this.configService.get<string>("DIRECT_URL");
		const databaseUrl = this.configService.get<string>("DATABASE_URL");
		const connectionUrls = Array.from(
			new Set([directUrl, databaseUrl].filter(Boolean)),
		) as string[];

		if (connectionUrls.length === 0) {
			throw new Error("DATABASE_URL or DIRECT_URL is not defined");
		}

		this.logger.debug(
			`OIDC Direct Prisma 클라이언트 생성 (directUrl: ${directUrl ? "사용" : "미사용"}, fallback: ${databaseUrl ? "사용" : "미사용"})`,
		);

		const connectionErrors: unknown[] = [];

		for (const [index, connectionUrl] of connectionUrls.entries()) {
			this.logger.log(
				`OIDC Direct Prisma 연결 대상 확인 (${getOidcDirectPrismaConnectionTarget(connectionUrl)})`,
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

				if (index > 0) {
					this.logger.warn(
						"OIDC Direct Prisma가 fallback DATABASE_URL로 연결되었습니다.",
					);
				}

				return this.prisma;
			} catch (error) {
				connectionErrors.push(error);
				this.logger.warn(
					`OIDC Direct Prisma 연결 실패, 다음 연결 문자열로 재시도합니다. (${getOidcDirectPrismaConnectionTarget(connectionUrl)})`,
				);
				this.prisma = null;
				if (this.pool) {
					await this.pool.end().catch(() => undefined);
					this.pool = null;
				}
			}
		}

		const finalError = connectionErrors.at(-1);
		this.logger.error("OIDC Direct Prisma 연결 실패", finalError);
		throw finalError;
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
