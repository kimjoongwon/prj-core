import { PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Prisma types for OidcModel operations
interface OidcModelData {
	key: string;
	modelType: string;
	payload: object;
	expiresAt: Date | null;
	grantId: string | null;
	userCode: string | null;
	uid: string | null;
}

interface OidcModelDelegate {
	upsert: (args: {
		where: { key: string };
		create: Omit<OidcModelData, "expiresAt"> & { expiresAt: Date | null };
		update: Partial<OidcModelData>;
	}) => Promise<OidcModelData>;
	findUnique: (args: {
		where: { key?: string; userCode?: string; uid?: string };
	}) => Promise<(OidcModelData & { expiresAt: Date | null }) | null>;
	deleteMany: (args: { where: { key?: string; grantId?: string } }) => Promise<unknown>;
	update: (args: {
		where: { key: string };
		data: { payload: object };
	}) => Promise<OidcModelData>;
}

interface OidcPrismaClient {
	oidcModel: OidcModelDelegate;
}

// oidc-provider 타입 (@types/oidc-provider 기반)
interface AdapterPayload {
	[key: string]: unknown;
	accountId?: string;
	acr?: string;
	amr?: string[];
	authTime?: number;
	claims?: object;
	clientId?: string;
	consumed?: number;
	deviceInfo?: object;
	exp?: number;
	grantId?: string;
	gty?: string;
	iat?: number;
	iiat?: number;
	jti?: string;
	kind?: string;
	nonce?: string;
	params?: object;
	resource?: string;
	result?: object;
	rotations?: number;
	scope?: string;
	session?: { uid: string; jti: string };
	sessionUid?: string;
	sid?: string;
	uid?: string;
	userCode?: string;
}

interface Adapter {
	upsert(id: string, payload: AdapterPayload, expiresIn: number): Promise<void>;
	find(id: string): Promise<AdapterPayload | undefined | void>;
	findByUserCode?(userCode: string): Promise<AdapterPayload | undefined | void>;
	findByUid?(uid: string): Promise<AdapterPayload | undefined | void>;
	destroy(id: string): Promise<void>;
	revokeByGrantId?(grantId: string): Promise<void>;
	consume?(id: string): Promise<void>;
}

/**
 * Prisma Adapter for oidc-provider
 * oidc-provider가 토큰, 세션 등을 저장/조회할 때 사용하는 어댑터
 */
export class PrismaOidcAdapter implements Adapter {
	constructor(
		private readonly modelType: string,
		private readonly prisma: OidcPrismaClient,
	) {}

	async upsert(
		id: string,
		payload: AdapterPayload,
		expiresIn: number,
	): Promise<void> {
		const expiresAt = expiresIn
			? new Date(Date.now() + expiresIn * 1000)
			: null;

		await this.prisma.oidcModel.upsert({
			where: { key: id },
			create: {
				key: id,
				modelType: this.modelType,
				payload: payload as object,
				expiresAt,
				grantId: payload.grantId,
				userCode: payload.userCode,
				uid: payload.uid,
			},
			update: {
				payload: payload as object,
				expiresAt,
				grantId: payload.grantId,
				userCode: payload.userCode,
				uid: payload.uid,
			},
		});
	}

	async find(id: string): Promise<AdapterPayload | undefined> {
		const model = await this.prisma.oidcModel.findUnique({
			where: { key: id },
		});

		if (!model || (model.expiresAt && model.expiresAt < new Date())) {
			return undefined;
		}

		return model.payload as AdapterPayload;
	}

	async findByUserCode(userCode: string): Promise<AdapterPayload | undefined> {
		const model = await this.prisma.oidcModel.findUnique({
			where: { userCode },
		});

		if (!model || (model.expiresAt && model.expiresAt < new Date())) {
			return undefined;
		}

		return model.payload as AdapterPayload;
	}

	async findByUid(uid: string): Promise<AdapterPayload | undefined> {
		const model = await this.prisma.oidcModel.findUnique({
			where: { uid },
		});

		if (!model || (model.expiresAt && model.expiresAt < new Date())) {
			return undefined;
		}

		return model.payload as AdapterPayload;
	}

	async destroy(id: string): Promise<void> {
		await this.prisma.oidcModel.deleteMany({
			where: { key: id },
		});
	}

	async revokeByGrantId(grantId: string): Promise<void> {
		await this.prisma.oidcModel.deleteMany({
			where: { grantId },
		});
	}

	async consume(id: string): Promise<void> {
		const model = await this.prisma.oidcModel.findUnique({
			where: { key: id },
		});

		if (model) {
			const payload = model.payload as AdapterPayload;
			payload.consumed = Math.floor(Date.now() / 1000);

			await this.prisma.oidcModel.update({
				where: { key: id },
				data: { payload: payload as object },
			});
		}
	}
}

/**
 * Prisma Adapter Factory
 * oidc-provider가 각 모델 타입별로 어댑터 인스턴스를 생성할 때 사용
 *
 * - DIRECT_URL을 사용하여 RLS 우회
 * - OIDC 토큰/세션 저장은 tenant 컨텍스트 없이 접근해야 함
 */
@Injectable()
export class PrismaOidcAdapterFactory implements OnModuleDestroy {
	private readonly logger = new Logger(PrismaOidcAdapterFactory.name);
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

		this.logger.debug(
			`OIDC Adapter용 Prisma 클라이언트 생성 (directUrl: ${directUrl ? "사용" : "미사용"})`,
		);

		// PostgreSQL connection pool 생성
		this.pool = new pg.Pool({
			connectionString: connectionUrl,
			max: 10,
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

	createAdapter(modelType: string): Adapter {
		// 동기적 호출을 위해 Promise를 캐싱하는 방식으로 변경
		// oidc-provider는 동기적으로 어댑터를 생성하므로 lazy initialization 사용
		return new PrismaOidcAdapter(modelType, this.getPrismaClientSync());
	}

	/**
	 * 동기적으로 Prisma 클라이언트 반환 (초기화는 비동기로 진행됨)
	 * oidc-provider의 adapter factory는 동기적으로 호출되므로
	 * 프록시 패턴을 사용하여 실제 호출 시점에 await
	 */
	private getPrismaClientSync(): OidcPrismaClient {
		const factory = this;
		return {
			oidcModel: {
				async upsert(args) {
					const prisma = await factory.getPrismaClient();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return prisma.oidcModel.upsert(args as any);
				},
				async findUnique(args) {
					const prisma = await factory.getPrismaClient();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return prisma.oidcModel.findUnique(args as any);
				},
				async deleteMany(args) {
					const prisma = await factory.getPrismaClient();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return prisma.oidcModel.deleteMany(args as any);
				},
				async update(args) {
					const prisma = await factory.getPrismaClient();
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					return prisma.oidcModel.update(args as any);
				},
			},
		} as OidcPrismaClient;
	}

	getAdapterFactory(): (modelType: string) => Adapter {
		return (modelType: string) => this.createAdapter(modelType);
	}
}
