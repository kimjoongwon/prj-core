import { OidcModel } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class OidcModelsRepository {
	private readonly logger = new Logger("OidcModelsRepository");

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {}

	async findByKey(key: string): Promise<OidcModel | null> {
		this.logger.debug(`Key로 조회: ${key.slice(0, 8)}...`);
		const result = await this.txHost.tx.oidcModel.findUnique({
			where: { key },
		});
		return result ? plainToInstance(OidcModel, result) : null;
	}

	async findByKeyOrThrow(key: string): Promise<OidcModel> {
		const result = await this.findByKey(key);
		if (!result) {
			throw new Error(`OidcModel not found: ${key}`);
		}
		return result;
	}

	async findMany(params: {
		where: Prisma.OidcModelWhereInput;
		orderBy?: Record<string, "asc" | "desc">[];
		skip?: number;
		take?: number;
	}): Promise<{ data: OidcModel[]; totalCount: number }> {
		const { where, orderBy, skip, take } = params;
		this.logger.debug("세션/토큰 목록 조회");

		const [data, totalCount] = await Promise.all([
			this.txHost.tx.oidcModel.findMany({
				where,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.oidcModel.count({ where }),
		]);

		return {
			data: data.map((item) => plainToInstance(OidcModel, item)),
			totalCount,
		};
	}

	async findManyByGrantId(grantId: string): Promise<OidcModel[]> {
		this.logger.debug(`Grant ID로 조회: ${grantId.slice(0, 8)}...`);
		const results = await this.txHost.tx.oidcModel.findMany({
			where: { grantId },
		});
		return results.map((item) => plainToInstance(OidcModel, item));
	}

	async deleteByKey(key: string): Promise<void> {
		this.logger.debug(`Key로 삭제: ${key.slice(0, 8)}...`);
		await this.txHost.tx.oidcModel.delete({ where: { key } });
	}

	async deleteManyByGrantId(grantId: string): Promise<number> {
		this.logger.debug(`Grant ID로 일괄 삭제: ${grantId.slice(0, 8)}...`);
		const result = await this.txHost.tx.oidcModel.deleteMany({
			where: { grantId },
		});
		return result.count;
	}
}
