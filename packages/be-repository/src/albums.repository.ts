import { Album, AlbumEntry } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AlbumRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("AlbumRepository");
	}

	// ============================================================================
	// 조회 (Album)
	// ============================================================================

	/**
	 * ID로 앨범 조회
	 */
	async findById(id: string): Promise<Album | null> {
		this.logger.debug(`ID로 앨범 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.findUnique({
			where: { id, removedAt: null },
		});

		return result ? plainToInstance(Album, result) : null;
	}

	/**
	 * ID로 앨범 조회 (엔트리 포함)
	 */
	async findByIdWithEntries(id: string): Promise<Album | null> {
		this.logger.debug(`ID로 앨범 조회 (엔트리 포함): ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.findUnique({
			where: { id, removedAt: null },
			include: {
				entries: {
					where: { removedAt: null },
					include: {
						asset: true,
					},
					orderBy: { position: "asc" },
				},
			},
		});

		return result ? plainToInstance(Album, result) : null;
	}

	/**
	 * ID로 앨범 조회 (커버 에셋 포함)
	 */
	async findByIdWithCoverAsset(id: string): Promise<Album | null> {
		this.logger.debug(`ID로 앨범 조회 (커버 포함): ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.findUnique({
			where: { id, removedAt: null },
			include: {
				coverAsset: true,
			},
		});

		return result ? plainToInstance(Album, result) : null;
	}

	/**
	 * Space ID로 앨범 목록 조회
	 */
	async findManyBySpaceId(params: {
		spaceId: string;
		where?: Prisma.AlbumWhereInput;
		orderBy?: Prisma.AlbumOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Album[]; count: number }> {
		const { spaceId, where, orderBy, skip, take } = params;
		this.logger.debug(
			`Space ID로 앨범 목록 조회: spaceId=${spaceId.slice(-8)}`,
		);

		const baseWhere: Prisma.AlbumWhereInput = {
			spaceId,
			removedAt: null,
			...where,
		};

		const [items, count] = await Promise.all([
			this.txHost.tx.album.findMany({
				where: baseWhere,
				orderBy: orderBy ?? [{ sortOrder: "asc" }, { createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.album.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => plainToInstance(Album, item)),
			count,
		};
	}

	/**
	 * 여러 ID로 앨범 목록 조회
	 */
	async findByIds(ids: string[]): Promise<Album[]> {
		this.logger.debug(`여러 ID로 앨범 조회: count=${ids.length}`);

		const results = await this.txHost.tx.album.findMany({
			where: {
				id: { in: ids },
				removedAt: null,
			},
		});

		return results.map((result) => plainToInstance(Album, result));
	}

	/**
	 * Space ID로 앨범 수 조회
	 */
	async countBySpaceId(spaceId: string): Promise<number> {
		this.logger.debug(`Space ID로 앨범 수 조회: spaceId=${spaceId.slice(-8)}`);

		return this.txHost.tx.album.count({
			where: {
				spaceId,
				removedAt: null,
			},
		});
	}

	// ============================================================================
	// Service 호환성을 위한 별칭 메서드
	// ============================================================================

	/**
	 * findBySpaceId 별칭
	 */
	async findBySpaceId(params: {
		spaceId: string;
		where?: Prisma.AlbumWhereInput;
		orderBy?: Prisma.AlbumOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Album[]; count: number }> {
		return this.findManyBySpaceId(params);
	}

	/**
	 * 앨범 검색
	 */
	async search(params: {
		spaceId: string;
		search: string;
		skip?: number;
		take?: number;
	}): Promise<{ items: Album[]; count: number }> {
		const { spaceId, search, skip, take } = params;
		this.logger.debug(`앨범 검색: spaceId=${spaceId.slice(-8)}, search=${search}`);

		const where: Prisma.AlbumWhereInput = {
			spaceId,
			removedAt: null,
			name: { contains: search, mode: "insensitive" },
		};

		const [items, count] = await Promise.all([
			this.txHost.tx.album.findMany({
				where,
				orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
				skip,
				take,
			}),
			this.txHost.tx.album.count({ where }),
		]);

		return {
			items: items.map((item) => plainToInstance(Album, item)),
			count,
		};
	}

	/**
	 * 이름으로 앨범 조회
	 */
	async findByName(spaceId: string, name: string): Promise<Album | null> {
		this.logger.debug(`이름으로 앨범 조회: spaceId=${spaceId.slice(-8)}, name=${name}`);

		const result = await this.txHost.tx.album.findFirst({
			where: {
				spaceId,
				name,
				removedAt: null,
			},
		});

		return result ? plainToInstance(Album, result) : null;
	}

	/**
	 * count 별칭
	 */
	async count(spaceId: string): Promise<number> {
		return this.countBySpaceId(spaceId);
	}

	/**
	 * update 별칭
	 */
	async update(
		id: string,
		data: Prisma.AlbumUncheckedUpdateInput,
	): Promise<Album> {
		return this.updateById(id, data);
	}

	/**
	 * softDelete 별칭
	 */
	async softDelete(id: string): Promise<Album> {
		return this.removeById(id);
	}

	/**
	 * countEntries 별칭
	 */
	async countEntries(albumId: string): Promise<number> {
		return this.countEntriesByAlbumId(albumId);
	}

	/**
	 * findNextEntryPosition 별칭
	 */
	async findNextEntryPosition(albumId: string): Promise<number> {
		return this.findNextPosition(albumId);
	}

	// ============================================================================
	// 생성/수정/삭제 (Album)
	// ============================================================================

	/**
	 * 앨범 생성
	 */
	async create(data: Prisma.AlbumUncheckedCreateInput): Promise<Album> {
		this.logger.debug("앨범 생성 중...");

		const result = await this.txHost.tx.album.create({
			data,
		});

		return plainToInstance(Album, result);
	}

	/**
	 * 앨범 수정
	 */
	async updateById(
		id: string,
		data: Prisma.AlbumUncheckedUpdateInput,
	): Promise<Album> {
		this.logger.debug(`앨범 수정 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.update({
			where: { id },
			data,
		});

		return plainToInstance(Album, result);
	}

	/**
	 * 앨범 소프트 삭제
	 */
	async removeById(id: string): Promise<Album> {
		this.logger.debug(`앨범 소프트 삭제 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return plainToInstance(Album, result);
	}

	/**
	 * 앨범 복원
	 */
	async restoreById(id: string): Promise<Album> {
		this.logger.debug(`앨범 복원 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.album.update({
			where: { id },
			data: { removedAt: null },
		});

		return plainToInstance(Album, result);
	}

	// ============================================================================
	// AlbumEntry 관리
	// ============================================================================

	/**
	 * 앨범 엔트리 추가
	 */
	async addEntry(params: {
		albumId: string;
		assetId: string;
		spaceId: string;
		position: number;
		caption?: string;
	}): Promise<AlbumEntry> {
		const { albumId, assetId, spaceId, position, caption } = params;
		this.logger.debug(
			`엔트리 추가: albumId=${albumId.slice(-8)}, assetId=${assetId.slice(-8)}`,
		);

		const result = await this.txHost.tx.albumEntry.create({
			data: {
				albumId,
				assetId,
				spaceId,
				position,
				caption,
			},
		});

		return plainToInstance(AlbumEntry, result);
	}

	/**
	 * 앨범 엔트리 제거 (소프트 삭제)
	 */
	async removeEntry(albumId: string, assetId: string): Promise<AlbumEntry> {
		this.logger.debug(
			`엔트리 제거: albumId=${albumId.slice(-8)}, assetId=${assetId.slice(-8)}`,
		);

		const result = await this.txHost.tx.albumEntry.update({
			where: {
				albumId_assetId: { albumId, assetId },
			},
			data: { removedAt: new Date() },
		});

		return plainToInstance(AlbumEntry, result);
	}

	/**
	 * 앨범 엔트리 순서 변경
	 */
	async reorderEntries(
		albumId: string,
		entryPositions: { assetId: string; position: number }[],
	): Promise<number> {
		this.logger.debug(`엔트리 순서 변경: albumId=${albumId.slice(-8)}`);

		const updates = entryPositions.map(({ assetId, position }) =>
			this.txHost.tx.albumEntry.update({
				where: {
					albumId_assetId: { albumId, assetId },
				},
				data: { position },
			}),
		);

		const results = await Promise.all(updates);
		return results.length;
	}

	/**
	 * 앨범 엔트리 캡션 수정
	 */
	async updateEntryCaption(
		albumId: string,
		assetId: string,
		caption: string,
	): Promise<AlbumEntry> {
		this.logger.debug(
			`엔트리 캡션 수정: albumId=${albumId.slice(-8)}, assetId=${assetId.slice(-8)}`,
		);

		const result = await this.txHost.tx.albumEntry.update({
			where: {
				albumId_assetId: { albumId, assetId },
			},
			data: { caption },
		});

		return plainToInstance(AlbumEntry, result);
	}

	/**
	 * 앨범의 다음 position 값 조회
	 */
	async findNextPosition(albumId: string): Promise<number> {
		this.logger.debug(`다음 position 조회: albumId=${albumId.slice(-8)}`);

		const lastEntry = await this.txHost.tx.albumEntry.findFirst({
			where: { albumId, removedAt: null },
			orderBy: { position: "desc" },
			select: { position: true },
		});

		return (lastEntry?.position ?? -1) + 1;
	}

	/**
	 * 앨범 엔트리 수 조회
	 */
	async countEntriesByAlbumId(albumId: string): Promise<number> {
		this.logger.debug(`엔트리 수 조회: albumId=${albumId.slice(-8)}`);

		return this.txHost.tx.albumEntry.count({
			where: {
				albumId,
				removedAt: null,
			},
		});
	}

	// ============================================================================
	// AlbumEntry 조회
	// ============================================================================

	/**
	 * 앨범 엔트리 조회 (단일)
	 */
	async findEntryByAlbumIdAndAssetId(
		albumId: string,
		assetId: string,
	): Promise<AlbumEntry | null> {
		this.logger.debug(
			`엔트리 조회: albumId=${albumId.slice(-8)}, assetId=${assetId.slice(-8)}`,
		);

		const result = await this.txHost.tx.albumEntry.findUnique({
			where: {
				albumId_assetId: { albumId, assetId },
				removedAt: null,
			},
		});

		return result ? plainToInstance(AlbumEntry, result) : null;
	}

	/**
	 * 앨범의 모든 엔트리 조회
	 */
	async findEntriesByAlbumId(albumId: string): Promise<AlbumEntry[]> {
		this.logger.debug(`엔트리 목록 조회: albumId=${albumId.slice(-8)}`);

		const results = await this.txHost.tx.albumEntry.findMany({
			where: {
				albumId,
				removedAt: null,
			},
			orderBy: { position: "asc" },
		});

		return results.map((result) => plainToInstance(AlbumEntry, result));
	}

	/**
	 * 에셋이 포함된 앨범 ID 목록 조회
	 */
	async findAlbumIdsByAssetId(assetId: string): Promise<string[]> {
		this.logger.debug(`에셋이 포함된 앨범 조회: assetId=${assetId.slice(-8)}`);

		const entries = await this.txHost.tx.albumEntry.findMany({
			where: {
				assetId,
				removedAt: null,
			},
			select: { albumId: true },
		});

		return entries.map((entry) => entry.albumId);
	}
}
