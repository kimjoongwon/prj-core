import { canAccessAllSpaces } from "@cocrepo/be-common";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { AlbumQueryDto } from "@cocrepo/dto";
import type { Prisma } from "@cocrepo/prisma";
import { Album, AlbumEntry } from "@cocrepo/entity";
import { AlbumRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { ClsService } from "nestjs-cls";

/**
 * 앨범 목록 조회 결과
 */
export interface GetAlbumsResult {
	albums: Album[];
	totalCount: number;
}

/**
 * 앨범 서비스
 *
 * 앨범 CRUD 및 엔트리 관리 비즈니스 로직을 담당합니다.
 * Space 기반 접근 권한을 검증합니다.
 */
@Injectable()
export class AlbumService {
	private readonly logger = new Logger(AlbumService.name);

	constructor(
		private readonly repository: AlbumRepository,
		private readonly cls: ClsService,
	) {}

	// ============================================================================
	// Private Helpers
	// ============================================================================

	/**
	 * 현재 요청의 Space ID를 가져옵니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new BadRequestException("Space가 선택되지 않았습니다.");
		}
		return spaceId;
	}

	/**
	 * 전체 Space 접근 권한 확인
	 */
	private canAccessAllSpaces(): boolean {
		const tenant = this.cls.get(CONTEXT_KEYS.TENANT);
		return tenant ? canAccessAllSpaces(tenant) : false;
	}

	/**
	 * 앨범 조회 및 Space 접근 권한 검증
	 */
	private async getAlbumWithAccessCheck(albumId: string): Promise<Album> {
		const spaceId = this.getSpaceId();
		const album = await this.repository.findById(albumId);

		if (!album) {
			throw new NotFoundException("앨범을 찾을 수 없습니다.");
		}

		if (!this.canAccessAllSpaces() && album.spaceId !== spaceId) {
			throw new NotFoundException("앨범을 찾을 수 없습니다.");
		}

		return album;
	}

	// ============================================================================
	// 앨범 조회
	// ============================================================================

	/**
	 * ID로 앨범 조회
	 */
	async findById(id: string): Promise<Album> {
		this.logger.debug(`ID로 앨범 조회: albumId=${id}`);

		const album = await this.repository.findById(id);

		if (!album) {
			throw new NotFoundException("앨범을 찾을 수 없습니다.");
		}

		// Space 접근 권한 확인
		const spaceId = this.getSpaceId();
		if (!this.canAccessAllSpaces() && album.spaceId !== spaceId) {
			throw new NotFoundException("앨범을 찾을 수 없습니다.");
		}

		return album;
	}

	/**
	 * Space별 앨범 목록 조회
	 */
	async findBySpace(query: AlbumQueryDto): Promise<GetAlbumsResult> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`Space 내 앨범 목록 조회: spaceId=${spaceId}`);

		// 전체 접근 권한이 있고 query에 spaceId가 있으면 해당 spaceId 사용
		const targetSpaceId =
			this.canAccessAllSpaces() && query.spaceId ? query.spaceId : spaceId;

		const baseWhere: Partial<Prisma.AlbumWhereInput> = {
			spaceId: targetSpaceId,
		};

		const where = query.toPrismaWhere(baseWhere);
		const orderBy = query.toPrismaOrderBy();

		const { items, count } = await this.repository.findBySpaceId({
			spaceId: targetSpaceId,
			where,
			orderBy,
			skip: query.skip ?? 0,
			take: query.take ?? 10,
		});

		return {
			albums: items,
			totalCount: count,
		};
	}

	/**
	 * 앨범 검색
	 */
	async search(
		keyword: string,
		query: AlbumQueryDto,
	): Promise<GetAlbumsResult> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`앨범 검색: spaceId=${spaceId}, keyword=${keyword}`,
		);

		// 전체 접근 권한이 있고 query에 spaceId가 있으면 해당 spaceId 사용
		const targetSpaceId =
			this.canAccessAllSpaces() && query.spaceId ? query.spaceId : spaceId;

		const { items, count } = await this.repository.search({
			spaceId: targetSpaceId,
			search: keyword,
			skip: query.skip ?? 0,
			take: query.take ?? 10,
		});

		return {
			albums: items,
			totalCount: count,
		};
	}

	// ============================================================================
	// 앨범 생성/수정/삭제
	// ============================================================================

	/**
	 * 앨범 생성
	 */
	async create(input: {
		name: string;
		description?: string | null;
		coverAssetId?: string | null;
		sortOrder?: number;
	}): Promise<Album> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`앨범 생성: spaceId=${spaceId}, name=${input.name}`);

		// 이름 중복 확인
		const existingAlbum = await this.repository.findByName(
			spaceId,
			input.name,
		);
		if (existingAlbum) {
			throw new ConflictException("이미 존재하는 앨범명입니다.");
		}

		// sortOrder가 없으면 마지막 순서 + 1로 설정
		const sortOrder =
			input.sortOrder ?? (await this.repository.count(spaceId));

		return this.repository.create({
			name: input.name,
			description: input.description ?? null,
			coverAssetId: input.coverAssetId ?? null,
			sortOrder,
			spaceId,
		} as Prisma.AlbumUncheckedCreateInput);
	}

	/**
	 * 앨범 수정
	 */
	async update(
		id: string,
		input: {
			name?: string;
			description?: string | null;
			sortOrder?: number;
		},
	): Promise<Album> {
		this.logger.debug(`앨범 수정: albumId=${id}`);

		const album = await this.getAlbumWithAccessCheck(id);

		// 이름 변경이 있는 경우 중복 확인
		if (input.name && input.name !== album.name) {
			const existingAlbum = await this.repository.findByName(
				album.spaceId,
				input.name,
			);
			if (existingAlbum) {
				throw new ConflictException("이미 존재하는 앨범명입니다.");
			}
		}

		return this.repository.update(id, input as Prisma.AlbumUncheckedUpdateInput);
	}

	/**
	 * 커버 이미지 설정
	 */
	async setCover(id: string, assetId: string): Promise<Album> {
		this.logger.debug(`커버 이미지 설정: albumId=${id}, assetId=${assetId}`);

		await this.getAlbumWithAccessCheck(id);

		// TODO: AssetService를 통해 에셋 존재 및 같은 Space 확인
		// const asset = await this.assetService.findById(assetId);
		// if (!asset) {
		//   throw new NotFoundException("에셋을 찾을 수 없습니다.");
		// }

		return this.repository.update(id, { coverAssetId: assetId });
	}

	/**
	 * 커버 이미지 제거
	 */
	async clearCover(id: string): Promise<Album> {
		this.logger.debug(`커버 이미지 제거: albumId=${id}`);

		await this.getAlbumWithAccessCheck(id);

		return this.repository.update(id, { coverAssetId: null });
	}

	/**
	 * 앨범 삭제 (Soft Delete)
	 */
	async softDelete(id: string): Promise<void> {
		this.logger.debug(`앨범 삭제: albumId=${id}`);

		await this.getAlbumWithAccessCheck(id);
		await this.repository.softDelete(id);
	}

	// ============================================================================
	// 앨범 엔트리 관리
	// ============================================================================

	/**
	 * 앨범 엔트리 목록 조회
	 */
	async getEntries(
		albumId: string,
		query?: { skip?: number; take?: number },
	): Promise<{ entries: AlbumEntry[]; totalCount: number }> {
		this.logger.debug(`앨범 엔트리 목록 조회: albumId=${albumId}`);

		await this.getAlbumWithAccessCheck(albumId);

		const entries = await this.repository.findEntriesByAlbumId(albumId);
		const totalCount = await this.repository.countEntries(albumId);

		// 페이지네이션 적용
		const skip = query?.skip ?? 0;
		const take = query?.take ?? entries.length;
		const paginatedEntries = entries.slice(skip, skip + take);

		return {
			entries: paginatedEntries,
			totalCount,
		};
	}

	/**
	 * 앨범에 에셋 추가
	 */
	async addAssets(
		albumId: string,
		assetIds: string[],
	): Promise<AlbumEntry[]> {
		this.logger.debug(
			`앨범에 에셋 추가: albumId=${albumId}, count=${assetIds.length}`,
		);

		const album = await this.getAlbumWithAccessCheck(albumId);

		const entries: AlbumEntry[] = [];
		for (const assetId of assetIds) {
			// 이미 추가된 에셋인지 확인
			const existingEntry = await this.repository.findEntryByAlbumIdAndAssetId(
				albumId,
				assetId,
			);
			if (existingEntry) {
				throw new ConflictException("이미 앨범에 포함된 에셋입니다.");
			}

			// 다음 position 조회
			const position = await this.repository.findNextEntryPosition(albumId);

			const entry = await this.repository.addEntry({
				albumId,
				assetId,
				spaceId: album.spaceId,
				position,
			});

			entries.push(entry);
		}

		return entries;
	}

	/**
	 * 앨범에서 엔트리 제거
	 */
	async removeEntry(albumId: string, entryId: string): Promise<void> {
		this.logger.debug(`앨범에서 엔트리 제거: albumId=${albumId}, entryId=${entryId}`);

		await this.getAlbumWithAccessCheck(albumId);

		// entryId는 assetId와 동일 (복합키)
		const entry = await this.repository.findEntryByAlbumIdAndAssetId(
			albumId,
			entryId,
		);
		if (!entry) {
			throw new NotFoundException("엔트리를 찾을 수 없습니다.");
		}

		await this.repository.removeEntry(albumId, entryId);
	}

	/**
	 * 앨범 엔트리 순서 변경
	 */
	async reorderEntries(albumId: string, entryIds: string[]): Promise<void> {
		this.logger.debug(`앨범 엔트리 순서 변경: albumId=${albumId}`);

		await this.getAlbumWithAccessCheck(albumId);

		// 모든 entryId가 해당 앨범에 속하는지 확인
		const entries = await this.repository.findEntriesByAlbumId(albumId);
		const existingEntryIds = new Set(entries.map((e) => e.assetId));

		for (const entryId of entryIds) {
			if (!existingEntryIds.has(entryId)) {
				throw new BadRequestException(
					"모든 entryId가 해당 앨범에 속해야 합니다.",
				);
			}
		}

		// 중복된 entryId 확인
		const uniqueEntryIds = new Set(entryIds);
		if (uniqueEntryIds.size !== entryIds.length) {
			throw new BadRequestException("중복된 entryId가 있습니다.");
		}

		// 순서 변경
		const entryPositions = entryIds.map((assetId, index) => ({
			assetId,
			position: index,
		}));

		await this.repository.reorderEntries(albumId, entryPositions);
	}

	/**
	 * 앨범 엔트리 캡션 수정
	 */
	async updateCaption(
		albumId: string,
		entryId: string,
		caption: string,
	): Promise<AlbumEntry> {
		this.logger.debug(
			`엔트리 캡션 수정: albumId=${albumId}, entryId=${entryId}`,
		);

		await this.getAlbumWithAccessCheck(albumId);

		const entry = await this.repository.findEntryByAlbumIdAndAssetId(
			albumId,
			entryId,
		);
		if (!entry) {
			throw new NotFoundException("엔트리를 찾을 수 없습니다.");
		}

		// TODO: Repository에 updateEntryCaption 메서드 추가 필요
		// 현재는 직접 업데이트하지 않고 기존 entry 반환
		return entry;
	}
}
