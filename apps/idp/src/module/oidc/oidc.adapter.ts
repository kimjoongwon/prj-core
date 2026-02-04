import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import { Inject, Injectable } from "@nestjs/common";

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

// oidc-provider is ESM-only, define types locally
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
 */
@Injectable()
export class PrismaOidcAdapterFactory {
	constructor(
		@Inject(PRISMA_SERVICE_TOKEN)
		private readonly prisma: OidcPrismaClient,
	) {}

	createAdapter(modelType: string): Adapter {
		return new PrismaOidcAdapter(modelType, this.prisma);
	}

	getAdapterFactory(): (modelType: string) => Adapter {
		return (modelType: string) => this.createAdapter(modelType);
	}
}
