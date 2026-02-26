import { Asset } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AssetRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("AssetRepository");
	}

	/**
	 * ID로 에셋 조회
	 */
	async findById(id: string): Promise<Asset | null> {
		this.logger.debug(`ID로 에셋 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.asset.findUnique({
			where: { id, removedAt: null },
		});

		return result ? plainToInstance(Asset, result) : null;
	}

	/**
	 * ID로 에셋 조회 (상세 정보 포함)
	 */
	async findByIdWithDetails(id: string): Promise<Asset | null> {
		this.logger.debug(`ID로 에셋 조회 (상세 포함): ${id.slice(-8)}`);

		const result = await this.txHost.tx.asset.findUnique({
			where: { id, removedAt: null },
			include: {
				image: true,
				video: true,
				document: true,
				derivatives: {
					where: { removedAt: null },
				},
				folder: true,
			},
		});

		return result ? plainToInstance(Asset, result) : null;
	}

	/**
	 * Space ID로 에셋 목록 조회
	 */
	async findManyBySpaceId(params: {
		spaceId: string;
		where?: Prisma.AssetWhereInput;
		orderBy?: Prisma.AssetOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Asset[]; count: number }> {
		const { spaceId, where, orderBy, skip, take } = params;
		this.logger.debug(
			`Space ID로 에셋 목록 조회: spaceId=${spaceId.slice(-8)}`,
		);

		const baseWhere: Prisma.AssetWhereInput = {
			spaceId,
			removedAt: null,
			...where,
		};

		const [items, count] = await Promise.all([
			this.txHost.tx.asset.findMany({
				where: baseWhere,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.asset.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => plainToInstance(Asset, item)),
			count,
		};
	}

	/**
	 * Folder ID로 에셋 목록 조회
	 */
	async findManyByFolderId(params: {
		folderId: string;
		where?: Prisma.AssetWhereInput;
		orderBy?: Prisma.AssetOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Asset[]; count: number }> {
		const { folderId, where, orderBy, skip, take } = params;
		this.logger.debug(
			`Folder ID로 에셋 목록 조회: folderId=${folderId.slice(-8)}`,
		);

		const baseWhere: Prisma.AssetWhereInput = {
			folderId,
			removedAt: null,
			...where,
		};

		const [items, count] = await Promise.all([
			this.txHost.tx.asset.findMany({
				where: baseWhere,
				orderBy: orderBy ?? [{ createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.asset.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => plainToInstance(Asset, item)),
			count,
		};
	}

	/**
	 * 에셋 생성
	 */
	async create(data: Prisma.AssetUncheckedCreateInput): Promise<Asset> {
		this.logger.debug("에셋 생성 중...");

		const result = await this.txHost.tx.asset.create({
			data,
		});

		return plainToInstance(Asset, result);
	}

	/**
	 * 에셋 생성 (상세 정보와 함께)
	 */
	async createWithDetails(params: {
		asset: Prisma.AssetUncheckedCreateInput;
		image?: Prisma.ImageUncheckedCreateInput;
		video?: Prisma.VideoUncheckedCreateInput;
		document?: Prisma.DocumentUncheckedCreateInput;
	}): Promise<Asset> {
		const { asset, image, video, document } = params;
		this.logger.debug("에셋 생성 중 (상세 포함)...");

		const result = await this.txHost.tx.asset.create({
			data: {
				...asset,
				image: image ? { create: image } : undefined,
				video: video ? { create: video } : undefined,
				document: document ? { create: document } : undefined,
			},
			include: {
				image: true,
				video: true,
				document: true,
			},
		});

		return plainToInstance(Asset, result);
	}

	/**
	 * 에셋 수정
	 */
	async updateById(
		id: string,
		data: Prisma.AssetUncheckedUpdateInput,
	): Promise<Asset> {
		this.logger.debug(`에셋 수정 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.asset.update({
			where: { id },
			data,
		});

		return plainToInstance(Asset, result);
	}

	/**
	 * 에셋 소프트 삭제
	 */
	async removeById(id: string): Promise<Asset> {
		this.logger.debug(`에셋 소프트 삭제 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.asset.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return plainToInstance(Asset, result);
	}

	/**
	 * 에셋 복원
	 */
	async restoreById(id: string): Promise<Asset> {
		this.logger.debug(`에셋 복원 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.asset.update({
			where: { id },
			data: { removedAt: null },
		});

		return plainToInstance(Asset, result);
	}

	/**
	 * 에셋 이동 (폴더 변경)
	 */
	async moveById(id: string, folderId: string): Promise<Asset> {
		this.logger.debug(
			`에셋 이동 중: ${id.slice(-8)} -> folderId=${folderId.slice(-8)}`,
		);

		const result = await this.txHost.tx.asset.update({
			where: { id },
			data: { folderId },
		});

		return plainToInstance(Asset, result);
	}

	/**
	 * Storage Key로 에셋 조회
	 */
	async findByStorageKey(storageKey: string): Promise<Asset | null> {
		this.logger.debug(`Storage Key로 에셋 조회: ${storageKey}`);

		const result = await this.txHost.tx.asset.findUnique({
			where: { storageKey, removedAt: null },
		});

		return result ? plainToInstance(Asset, result) : null;
	}

	/**
	 * 여러 ID로 에셋 목록 조회
	 */
	async findByIds(ids: string[]): Promise<Asset[]> {
		this.logger.debug(`여러 ID로 에셋 조회: count=${ids.length}`);

		const results = await this.txHost.tx.asset.findMany({
			where: {
				id: { in: ids },
				removedAt: null,
			},
		});

		return results.map((result) => plainToInstance(Asset, result));
	}

	/**
	 * Space ID로 에셋 수 조회
	 */
	async countBySpaceId(spaceId: string): Promise<number> {
		this.logger.debug(`Space ID로 에셋 수 조회: spaceId=${spaceId.slice(-8)}`);

		return this.txHost.tx.asset.count({
			where: {
				spaceId,
				removedAt: null,
			},
		});
	}

	/**
	 * Folder ID로 에셋 수 조회
	 */
	async countByFolderId(folderId: string): Promise<number> {
		this.logger.debug(
			`Folder ID로 에셋 수 조회: folderId=${folderId.slice(-8)}`,
		);

		return this.txHost.tx.asset.count({
			where: {
				folderId,
				removedAt: null,
			},
		});
	}
}
