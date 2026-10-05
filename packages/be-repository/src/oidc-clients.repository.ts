import { OidcClient } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { toDomainEntity } from "./to-domain-entity";

@Injectable()
export class OidcClientsRepository {
	private readonly logger = new Logger("OidcClientsRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findById(id: bigint): Promise<OidcClient | null> {
		this.logger.debug(`ID로 조회: ${id.toString()}`);
		const result = await this.txHost.tx.oidcClient.findUnique({
			where: { id },
		});
		return result ? toDomainEntity(OidcClient, result) : null;
	}

	async findByIdOrThrow(id: bigint): Promise<OidcClient> {
		const result = await this.findById(id);
		if (!result) {
			throw new Error(`OidcClient not found: ${id.toString()}`);
		}
		return result;
	}

	/** OIDC integration 경계에서 모델별 ULID로 조회합니다. */
	async findByOidcClientId(oidcClientId: string): Promise<OidcClient | null> {
		const result = await this.txHost.tx.oidcClient.findUnique({
			where: { oidcClientId },
		});
		return result ? toDomainEntity(OidcClient, result) : null;
	}

	async findByClientId(clientId: string): Promise<OidcClient | null> {
		this.logger.debug(`ClientID로 조회: ${clientId}`);
		const result = await this.txHost.tx.oidcClient.findUnique({
			where: { clientId },
		});
		return result ? toDomainEntity(OidcClient, result) : null;
	}

	async findMany(params: {
		where: Prisma.OidcClientWhereInput;
		orderBy: Prisma.OidcClientOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ data: OidcClient[]; totalCount: number }> {
		this.logger.debug("클라이언트 목록 조회");

		const notRemoved: Prisma.OidcClientWhereInput = {
			...params.where,
			removedAt: null,
		};

		const [data, totalCount] = await Promise.all([
			this.txHost.tx.oidcClient.findMany({
				where: notRemoved,
				orderBy: params.orderBy,
				skip: params.skip,
				take: params.take,
			}),
			this.txHost.tx.oidcClient.count({ where: notRemoved }),
		]);

		return {
			data: data.map((item) => toDomainEntity(OidcClient, item)),
			totalCount,
		};
	}

	/**
	 * 조건별 OIDC client 수 조회.
	 */
	async count(where: Prisma.OidcClientWhereInput): Promise<number> {
		return this.txHost.tx.oidcClient.count({ where });
	}

	async create(
		data: Prisma.OidcClientUncheckedCreateInput,
	): Promise<OidcClient> {
		this.logger.debug(`생성 중: ${data.clientId}`);
		const result = await this.txHost.tx.oidcClient.create({ data });
		return toDomainEntity(OidcClient, result);
	}

	async updateById(
		id: bigint,
		data: Prisma.OidcClientUncheckedUpdateInput,
	): Promise<OidcClient> {
		this.logger.debug(`업데이트 중: ${id.toString()}`);
		const result = await this.txHost.tx.oidcClient.update({
			where: { id },
			data,
		});
		return toDomainEntity(OidcClient, result);
	}

	async removeById(id: bigint): Promise<OidcClient> {
		this.logger.debug(`소프트 삭제: ${id.toString()}`);
		const result = await this.txHost.tx.oidcClient.update({
			where: { id },
			data: { removedAt: new Date(), isActive: false },
		});
		return toDomainEntity(OidcClient, result);
	}
}
