import { OidcClient } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class OidcClientsRepository {
	private readonly logger = new Logger("OidcClientsRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findById(id: string): Promise<OidcClient | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);
		const result = await this.txHost.tx.oidcClient.findUnique({
			where: { id },
		});
		return result ? plainToInstance(OidcClient, result) : null;
	}

	async findByIdOrThrow(id: string): Promise<OidcClient> {
		const result = await this.findById(id);
		if (!result) {
			throw new Error(`OidcClient not found: ${id}`);
		}
		return result;
	}

	async findByClientId(clientId: string): Promise<OidcClient | null> {
		this.logger.debug(`ClientID로 조회: ${clientId}`);
		const result = await this.txHost.tx.oidcClient.findUnique({
			where: { clientId },
		});
		return result ? plainToInstance(OidcClient, result) : null;
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
			data: data.map((item) => plainToInstance(OidcClient, item)),
			totalCount,
		};
	}

	async create(
		data: Prisma.OidcClientUncheckedCreateInput,
	): Promise<OidcClient> {
		this.logger.debug(`생성 중: ${data.clientId}`);
		const result = await this.txHost.tx.oidcClient.create({ data });
		return plainToInstance(OidcClient, result);
	}

	async updateById(
		id: string,
		data: Prisma.OidcClientUncheckedUpdateInput,
	): Promise<OidcClient> {
		this.logger.debug(`업데이트 중: ${id.slice(-8)}`);
		const result = await this.txHost.tx.oidcClient.update({
			where: { id },
			data,
		});
		return plainToInstance(OidcClient, result);
	}

	async removeById(id: string): Promise<OidcClient> {
		this.logger.debug(`소프트 삭제: ${id.slice(-8)}`);
		const result = await this.txHost.tx.oidcClient.update({
			where: { id },
			data: { removedAt: new Date(), isActive: false },
		});
		return plainToInstance(OidcClient, result);
	}
}
