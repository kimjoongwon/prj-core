import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

export interface OidcClientData {
	clientId: string;
	clientSecret: string | null;
	clientName: string;
	redirectUris: string[];
	grantTypes: string[];
	responseTypes: string[];
	tokenEndpointAuthMethod: string;
	scope: string;
}

/**
 * OIDC Client Repository
 * - DIRECT_URL을 사용하여 RLS 우회
 * - OIDC 클라이언트 설정은 tenant 컨텍스트 없이 접근해야 함
 */
@Injectable()
export class OidcClientRepository implements OnModuleDestroy {
	private readonly logger = new Logger(OidcClientRepository.name);
	private prisma: PrismaClient | null = null;
	private pool: pg.Pool | null = null;

	constructor(private readonly configService: ConfigService) {}

	/**
	 * DIRECT_URL을 사용하는 별도 Prisma 클라이언트 생성
	 * - RLS 우회를 위해 직접 연결 사용
	 */
	private async getPrismaClient(): Promise<PrismaClient> {
		if (this.prisma) return this.prisma;

		const directUrl = this.configService.get<string>("DIRECT_URL");
		const databaseUrl = this.configService.get<string>("DATABASE_URL");

		// DIRECT_URL 우선 사용 (pgbouncer 우회)
		const connectionUrl = directUrl || databaseUrl;

		if (!connectionUrl) {
			throw new Error("DATABASE_URL or DIRECT_URL is not defined");
		}

		this.logger.debug(`OIDC용 Prisma 클라이언트 생성 (directUrl: ${directUrl ? "사용" : "미사용"})`);

		// PostgreSQL connection pool 생성
		this.pool = new pg.Pool({
			connectionString: connectionUrl,
			max: 5,
			idleTimeoutMillis: 30000,
		});

		// Prisma PostgreSQL Adapter 생성
		const adapter = new PrismaPg(this.pool);

		// PrismaClient with adapter
		this.prisma = new PrismaClient({
			adapter,
		});

		return this.prisma;
	}

	async onModuleDestroy() {
		if (this.prisma) {
			await this.prisma.$disconnect();
		}
		if (this.pool) {
			await this.pool.end();
		}
	}

	/**
	 * 활성 OIDC 클라이언트 목록 조회
	 * - 초기화 시 호출되므로 직접 Prisma 사용 (RLS 우회)
	 */
	async findActiveClients(): Promise<OidcClientData[]> {
		this.logger.debug("활성 OIDC 클라이언트 조회 중...");

		const prisma = await this.getPrismaClient();
		const clients = await prisma.oidcClient.findMany({
			where: {
				isActive: true,
				removedAt: null,
			},
		});

		this.logger.log(`${clients.length}개의 OIDC 클라이언트 로드됨`);

		return clients.map((client) => ({
			clientId: client.clientId,
			clientSecret: client.clientSecret,
			clientName: client.clientName,
			redirectUris: client.redirectUris,
			grantTypes: client.grantTypes,
			responseTypes: client.responseTypes,
			tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
			scope: client.scope,
		}));
	}

	/**
	 * 클라이언트 ID로 조회
	 */
	async findByClientId(clientId: string): Promise<OidcClientData | null> {
		this.logger.debug(`클라이언트 조회: ${clientId}`);

		const prisma = await this.getPrismaClient();
		const client = await prisma.oidcClient.findUnique({
			where: { clientId },
		});

		if (!client) return null;

		return {
			clientId: client.clientId,
			clientSecret: client.clientSecret,
			clientName: client.clientName,
			redirectUris: client.redirectUris,
			grantTypes: client.grantTypes,
			responseTypes: client.responseTypes,
			tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
			scope: client.scope,
		};
	}
}
