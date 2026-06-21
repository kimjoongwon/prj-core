import { Asset } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AssetsRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("AssetsRepository");
	}

	async findById(id: string): Promise<Asset | null> {
		this.logger.debug(`ID로 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.asset.findUnique({ where: { id } });

		return result ? plainToInstance(Asset, result) : null;
	}

	async findByIdWithRelations(id: string): Promise<Asset | null> {
		this.logger.debug(`관계 포함 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.asset.findUnique({
			where: { id },
			include: {
				image: true,
				video: true,
				document: true,
				folder: true,
				tenant: true,
			},
		});

		return result ? plainToInstance(Asset, result) : null;
	}

	async findByStorageKey(storageKey: string): Promise<Asset | null> {
		this.logger.debug(`스토리지 키 조회: ${storageKey}`);

		const result = await this.txHost.tx.asset.findUnique({
			where: { storageKey },
		});

		return result ? plainToInstance(Asset, result) : null;
	}

	async findByFolderId(folderId: string): Promise<Asset[]> {
		this.logger.debug(`폴더별 에셋 조회: ${folderId.slice(-8)}`);

		const result = await this.txHost.tx.asset.findMany({
			where: { folderId },
			orderBy: [{ createdAt: "desc" }],
		});

		return result.map((item) => plainToInstance(Asset, item));
	}

	async findMany(params: {
		where?: Prisma.AssetWhereInput;
		orderBy?: Prisma.AssetOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ assets: Asset[]; totalCount: number }> {
		const [assets, totalCount] = await Promise.all([
			this.txHost.tx.asset.findMany({
				where: params.where,
				orderBy: params.orderBy ?? [{ createdAt: "desc" }],
				skip: params.skip,
				take: params.take,
				include: {
					folder: true,
				},
			}),
			this.txHost.tx.asset.count({ where: params.where }),
		]);

		return {
			assets: assets.map((item) => plainToInstance(Asset, item)),
			totalCount,
		};
	}

	async create(data: Prisma.AssetUncheckedCreateInput): Promise<Asset> {
		this.logger.debug(`에셋 생성: ${data.storageKey}`);

		const result = await this.txHost.tx.asset.create({ data });

		return plainToInstance(Asset, result);
	}

	async updateById(
		id: string,
		data: Prisma.AssetUncheckedUpdateInput,
	): Promise<Asset> {
		this.logger.debug(`에셋 수정: ${id.slice(-8)}`);

		const result = await this.txHost.tx.asset.update({
			where: { id },
			data,
		});

		return plainToInstance(Asset, result);
	}

	async deleteById(id: string): Promise<Asset> {
		this.logger.debug(`에셋 삭제: ${id.slice(-8)}`);

		const result = await this.txHost.tx.asset.delete({ where: { id } });

		return plainToInstance(Asset, result);
	}
}
