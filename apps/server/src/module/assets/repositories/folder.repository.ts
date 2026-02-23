import { Folder } from "@cocrepo/entity";
import { Prisma, PrismaClient } from "@cocrepo/prisma";
import { Injectable, Logger } from "@nestjs/common";
import { TransactionHost } from "@nestjs-cls/transactional";
import { TransactionalAdapterPrisma } from "@nestjs-cls/transactional-adapter-prisma";
import { plainToInstance } from "class-transformer";

@Injectable()
export class FolderRepository {
	private readonly logger: Logger;

	constructor(
		private readonly txHost: TransactionHost<
			TransactionalAdapterPrisma<PrismaClient>
		>,
	) {
		this.logger = new Logger("FolderRepository");
	}

	// ============================================================================
	// 단일 조회
	// ============================================================================

	/**
	 * ID로 폴더 조회
	 */
	async findById(id: string): Promise<Folder | null> {
		this.logger.debug(`ID로 폴더 조회: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.findUnique({
			where: { id, removedAt: null },
		});

		return result ? plainToInstance(Folder, result) : null;
	}

	/**
	 * ID로 폴더 조회 (하위 폴더 포함)
	 */
	async findByIdWithChildren(id: string): Promise<Folder | null> {
		this.logger.debug(`ID로 폴더 조회 (하위 폴더 포함): ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.findUnique({
			where: { id, removedAt: null },
			include: {
				children: {
					where: { removedAt: null },
					orderBy: { sortOrder: "asc" },
				},
			},
		});

		return result ? plainToInstance(Folder, result) : null;
	}

	/**
	 * ID로 폴더 조회 (상위 폴더 포함)
	 */
	async findByIdWithParent(id: string): Promise<Folder | null> {
		this.logger.debug(`ID로 폴더 조회 (상위 폴더 포함): ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.findUnique({
			where: { id, removedAt: null },
			include: {
				parent: true,
			},
		});

		return result ? plainToInstance(Folder, result) : null;
	}

	/**
	 * 경로로 폴더 조회
	 */
	async findByPath(path: string): Promise<Folder | null> {
		this.logger.debug(`경로로 폴더 조회: ${path}`);

		const result = await this.txHost.tx.folder.findUnique({
			where: { path, removedAt: null },
		});

		return result ? plainToInstance(Folder, result) : null;
	}

	/**
	 * 여러 ID로 폴더 목록 조회
	 */
	async findByIds(ids: string[]): Promise<Folder[]> {
		this.logger.debug(`여러 ID로 폴더 조회: count=${ids.length}`);

		const results = await this.txHost.tx.folder.findMany({
			where: {
				id: { in: ids },
				removedAt: null,
			},
			orderBy: { sortOrder: "asc" },
		});

		return results.map((result) => plainToInstance(Folder, result));
	}

	// ============================================================================
	// 목록 조회
	// ============================================================================

	/**
	 * Space 내 폴더 목록 조회
	 */
	async findManyBySpaceId(params: {
		spaceId: string;
		where?: Prisma.FolderWhereInput;
		orderBy?: Prisma.FolderOrderByWithRelationInput[];
		skip?: number;
		take?: number;
	}): Promise<{ items: Folder[]; count: number }> {
		const { spaceId, where, orderBy, skip, take } = params;
		this.logger.debug(`Space ID로 폴더 목록 조회: spaceId=${spaceId.slice(-8)}`);

		const baseWhere: Prisma.FolderWhereInput = {
			spaceId,
			removedAt: null,
			...where,
		};

		const [items, count] = await Promise.all([
			this.txHost.tx.folder.findMany({
				where: baseWhere,
				orderBy: orderBy ?? [{ sortOrder: "asc" }, { name: "asc" }],
				skip,
				take,
			}),
			this.txHost.tx.folder.count({ where: baseWhere }),
		]);

		return {
			items: items.map((item) => plainToInstance(Folder, item)),
			count,
		};
	}

	/**
	 * 하위 폴더 목록 조회
	 */
	async findChildren(folderId: string): Promise<Folder[]> {
		this.logger.debug(`하위 폴더 목록 조회: folderId=${folderId.slice(-8)}`);

		const results = await this.txHost.tx.folder.findMany({
			where: {
				parentFolderId: folderId,
				removedAt: null,
			},
			orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
		});

		return results.map((result) => plainToInstance(Folder, result));
	}

	/**
	 * 루트 폴더 목록 조회 (상위 폴더가 없는 폴더)
	 */
	async findRootFolders(spaceId: string): Promise<Folder[]> {
		this.logger.debug(`루트 폴더 목록 조회: spaceId=${spaceId.slice(-8)}`);

		const results = await this.txHost.tx.folder.findMany({
			where: {
				spaceId,
				parentFolderId: null,
				removedAt: null,
			},
			orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
		});

		return results.map((result) => plainToInstance(Folder, result));
	}

	/**
	 * 경로 접두사로 폴더 목록 조회 (하위 트리)
	 */
	async findManyByPathPrefix(pathPrefix: string): Promise<Folder[]> {
		this.logger.debug(`경로 접두사로 폴더 목록 조회: ${pathPrefix}`);

		const results = await this.txHost.tx.folder.findMany({
			where: {
				path: { startsWith: pathPrefix },
				removedAt: null,
			},
			orderBy: { path: "asc" },
		});

		return results.map((result) => plainToInstance(Folder, result));
	}

	// ============================================================================
	// 생성/수정/삭제
	// ============================================================================

	/**
	 * 폴더 생성
	 */
	async create(data: Prisma.FolderUncheckedCreateInput): Promise<Folder> {
		this.logger.debug("폴더 생성 중...");

		const result = await this.txHost.tx.folder.create({
			data,
		});

		return plainToInstance(Folder, result);
	}

	/**
	 * 폴더 수정
	 */
	async updateById(
		id: string,
		data: Prisma.FolderUncheckedUpdateInput,
	): Promise<Folder> {
		this.logger.debug(`폴더 수정 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.update({
			where: { id },
			data,
		});

		return plainToInstance(Folder, result);
	}

	/**
	 * 폴더 소프트 삭제
	 */
	async removeById(id: string): Promise<Folder> {
		this.logger.debug(`폴더 소프트 삭제 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.update({
			where: { id },
			data: { removedAt: new Date() },
		});

		return plainToInstance(Folder, result);
	}

	/**
	 * 폴더 복원
	 */
	async restoreById(id: string): Promise<Folder> {
		this.logger.debug(`폴더 복원 중: ${id.slice(-8)}`);

		const result = await this.txHost.tx.folder.update({
			where: { id },
			data: { removedAt: null },
		});

		return plainToInstance(Folder, result);
	}

	// ============================================================================
	// 트리 조회
	// ============================================================================

	/**
	 * 폴더 트리 조회 (재귀적으로 전체 트리)
	 */
	async findTreeBySpaceId(spaceId: string): Promise<Folder[]> {
		this.logger.debug(`폴더 트리 조회: spaceId=${spaceId.slice(-8)}`);

		// 루트 폴더부터 재귀적으로 조회
		const results = await this.txHost.tx.folder.findMany({
			where: {
				spaceId,
				parentFolderId: null,
				removedAt: null,
			},
			orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
			include: {
				children: {
					where: { removedAt: null },
					orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
				},
			},
		});

		return results.map((result) => plainToInstance(Folder, result));
	}

	// ============================================================================
	// 집계
	// ============================================================================

	/**
	 * Space 내 폴더 수 조회
	 */
	async countBySpaceId(spaceId: string): Promise<number> {
		this.logger.debug(`Space ID로 폴더 수 조회: spaceId=${spaceId.slice(-8)}`);

		return this.txHost.tx.folder.count({
			where: {
				spaceId,
				removedAt: null,
			},
		});
	}

	/**
	 * 하위 폴더 수 조회
	 */
	async countChildren(folderId: string): Promise<number> {
		this.logger.debug(`하위 폴더 수 조회: folderId=${folderId.slice(-8)}`);

		return this.txHost.tx.folder.count({
			where: {
				parentFolderId: folderId,
				removedAt: null,
			},
		});
	}

	/**
	 * 폴더 존재 여부 확인
	 */
	async existsById(id: string): Promise<boolean> {
		this.logger.debug(`폴더 존재 여부 확인: ${id.slice(-8)}`);

		const count = await this.txHost.tx.folder.count({
			where: { id, removedAt: null },
		});

		return count > 0;
	}

	/**
	 * 경로 존재 여부 확인
	 */
	async existsByPath(path: string): Promise<boolean> {
		this.logger.debug(`경로 존재 여부 확인: ${path}`);

		const count = await this.txHost.tx.folder.count({
			where: { path, removedAt: null },
		});

		return count > 0;
	}

	/**
	 * 동일 이름의 형제 폴더 존재 여부 확인
	 */
	async existsByNameInParent(
		spaceId: string,
		name: string,
		parentFolderId: string | null,
		excludeId?: string,
	): Promise<boolean> {
		this.logger.debug(
			`형제 폴더 존재 여부 확인: name=${name}, parentFolderId=${parentFolderId?.slice(-8) ?? "null"}`,
		);

		const count = await this.txHost.tx.folder.count({
			where: {
				spaceId,
				name,
				parentFolderId,
				removedAt: null,
				...(excludeId && { NOT: { id: excludeId } }),
			},
		});

		return count > 0;
	}
}
