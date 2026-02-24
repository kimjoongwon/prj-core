import { canAccessAllSpaces } from "@cocrepo/be-common";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { AlbumQueryDto } from "@cocrepo/dto";
import type { Prisma } from "@cocrepo/prisma";
import { Album, AlbumEntry } from "@cocrepo/entity";
import { AlbumRepository } from "@cocrepo/repository";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import type { CreateAlbumInput, UpdateAlbumInput } from "./input";

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
	 * 접근 가능한 Space 내 앨범 목록 조회
	 */
	async getAlbumsBySpace(query: AlbumQueryDto): Promise<GetAlbumsResult> {
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

		const { items, count } = await this.repository.findManyBySpaceId({
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
	 * 앨범 상세 조회 (엔트리 포함)
	 */
	async getAlbumDetailById(albumId: string): Promise<Album> {
		this.logger.debug(`앨범 상세 조회: albumId=${albumId}`);

		await this.getAlbumWithAccessCheck(albumId);
		const album = await this.repository.findByIdWithEntries(albumId);

		if (!album) {
			throw new NotFoundException("앨범을 찾을 수 없습니다.");
		}

		return album;
	}

	/**
	 * ID로 앨범 조회
	 */
	async getAlbumById(albumId: string): Promise<Album | null> {
		this.logger.debug(`ID로 앨범 조회: albumId=${albumId}`);
		return this.repository.findById(albumId);
	}

	/**
	 * 여러 ID로 앨범 목록 조회
	 */
	async getAlbumsByIds(ids: string[]): Promise<Album[]> {
		this.logger.debug(`여러 ID로 앨범 조회: count=${ids.length}`);
		return this.repository.findByIds(ids);
	}

	/**
	 * Space ID로 앨범 수 조회
	 */
	async countAlbumsBySpaceId(spaceId: string): Promise<number> {
		this.logger.debug(`Space ID로 앨범 수 조회: spaceId=${spaceId}`);
		return this.repository.countBySpaceId(spaceId);
	}

	// ============================================================================
	// 앨범 생성/수정/삭제
	// ============================================================================

	/**
	 * 앨범 생성
	 */
	async createAlbum(input: CreateAlbumInput): Promise<Album> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`앨범 생성: spaceId=${spaceId}`);

		// sortOrder가 없으면 마지막 순서 + 1로 설정
		const sortOrder =
			input.sortOrder ?? (await this.repository.countBySpaceId(spaceId));

		return this.repository.create({
			name: input.name,
			description: input.description,
			coverAssetId: input.coverAssetId,
			sortOrder,
			spaceId,
		} as Prisma.AlbumUncheckedCreateInput);
	}

	/**
	 * 앨범 수정
	 */
	async updateAlbum(albumId: string, input: UpdateAlbumInput): Promise<Album> {
		this.logger.debug(`앨범 수정: albumId=${albumId}`);

		await this.getAlbumWithAccessCheck(albumId);
		return this.repository.updateById(
			albumId,
			input as Prisma.AlbumUncheckedUpdateInput,
		);
	}

	/**
	 * 앨범 삭제 (Soft Delete)
	 */
	async deleteAlbum(albumId: string): Promise<Album> {
		this.logger.debug(`앨범 삭제: albumId=${albumId}`);

		await this.getAlbumWithAccessCheck(albumId);
		return this.repository.removeById(albumId);
	}

	/**
	 * 앨범 복원
	 */
	async restoreAlbum(albumId: string): Promise<Album> {
		this.logger.debug(`앨범 복원: albumId=${albumId}`);

		// 전체 접근 권한이 있는 경우에만 복원 가능
		if (!this.canAccessAllSpaces()) {
			throw new BadRequestException(
				"삭제된 앨범 복원은 전체 접근 권한이 필요합니다.",
			);
		}

		return this.repository.restoreById(albumId);
	}

	// ============================================================================
	// 커버 이미지 관리
	// ============================================================================

	/**
	 * 커버 이미지 설정
	 */
	async setCoverImage(albumId: string, coverAssetId: string): Promise<Album> {
		this.logger.debug(
			`커버 이미지 설정: albumId=${albumId}, coverAssetId=${coverAssetId}`,
		);

		await this.getAlbumWithAccessCheck(albumId);

		// TODO: AssetService를 통해 에셋 존재 및 같은 Space 확인
		// const asset = await this.assetService.getAssetById(coverAssetId);
		// if (!asset || asset.spaceId !== album.spaceId) {
		//   throw new BadRequestException("커버 이미지를 찾을 수 없습니다.");
		// }

		return this.repository.updateById(albumId, { coverAssetId });
	}

	/**
	 * 커버 이미지 제거
	 */
	async removeCoverImage(albumId: string): Promise<Album> {
		this.logger.debug(`커버 이미지 제거: albumId=${albumId}`);

		await this.getAlbumWithAccessCheck(albumId);
		return this.repository.updateById(albumId, { coverAssetId: null });
	}

	// ============================================================================
	// 앨범 엔트리 관리
	// ============================================================================

	/**
	 * 앨범에 에셋 추가
	 */
	async addAssetToAlbum(
		albumId: string,
		assetId: string,
		caption?: string,
	): Promise<AlbumEntry> {
		this.logger.debug(
			`앨범에 에셋 추가: albumId=${albumId}, assetId=${assetId}`,
		);

		const album = await this.getAlbumWithAccessCheck(albumId);

		// 이미 추가된 에셋인지 확인
		const existingEntry = await this.repository.findEntryByAlbumIdAndAssetId(
			albumId,
			assetId,
		);
		if (existingEntry) {
			throw new BadRequestException("이미 앨범에 추가된 에셋입니다.");
		}

		// 다음 position 조회
		const position = await this.repository.findNextPosition(albumId);

		return this.repository.addEntry({
			albumId,
			assetId,
			spaceId: album.spaceId,
			position,
			caption,
		});
	}

	/**
	 * 앨범에서 에셋 제거
	 */
	async removeAssetFromAlbum(
		albumId: string,
		assetId: string,
	): Promise<AlbumEntry> {
		this.logger.debug(
			`앨범에서 에셋 제거: albumId=${albumId}, assetId=${assetId}`,
		);

		await this.getAlbumWithAccessCheck(albumId);

		const entry = await this.repository.findEntryByAlbumIdAndAssetId(
			albumId,
			assetId,
		);
		if (!entry) {
			throw new NotFoundException("앨범에서 해당 에셋을 찾을 수 없습니다.");
		}

		return this.repository.removeEntry(albumId, assetId);
	}

	/**
	 * 앨범 엔트리 순서 변경
	 */
	async reorderAlbumEntries(
		albumId: string,
		entryPositions: { assetId: string; position: number }[],
	): Promise<number> {
		this.logger.debug(`앨범 엔트리 순서 변경: albumId=${albumId}`);

		await this.getAlbumWithAccessCheck(albumId);
		return this.repository.reorderEntries(albumId, entryPositions);
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
			`엔트리 캡션 수정: albumId=${albumId}, assetId=${assetId}`,
		);

		await this.getAlbumWithAccessCheck(albumId);

		const entry = await this.repository.findEntryByAlbumIdAndAssetId(
			albumId,
			assetId,
		);
		if (!entry) {
			throw new NotFoundException("앨범에서 해당 에셋을 찾을 수 없습니다.");
		}

		return this.repository.updateEntryCaption(albumId, assetId, caption);
	}

	/**
	 * 앨범 엔트리 목록 조회
	 */
	async getAlbumEntries(albumId: string): Promise<AlbumEntry[]> {
		this.logger.debug(`앨범 엔트리 목록 조회: albumId=${albumId}`);

		await this.getAlbumWithAccessCheck(albumId);
		return this.repository.findEntriesByAlbumId(albumId);
	}

	/**
	 * 앨범 엔트리 수 조회
	 */
	async countAlbumEntries(albumId: string): Promise<number> {
		this.logger.debug(`앨범 엔트리 수 조회: albumId=${albumId}`);

		await this.getAlbumWithAccessCheck(albumId);
		return this.repository.countEntriesByAlbumId(albumId);
	}

	/**
	 * 에셋이 포함된 앨범 ID 목록 조회
	 */
	async findAlbumIdsContainingAsset(assetId: string): Promise<string[]> {
		this.logger.debug(`에셋이 포함된 앨범 조회: assetId=${assetId}`);
		return this.repository.findAlbumIdsByAssetId(assetId);
	}

	// ============================================================================
	// 일괄 작업
	// ============================================================================

	/**
	 * 앨범에 여러 에셋 일괄 추가
	 */
	async addAssetsToAlbum(
		albumId: string,
		assetIds: string[],
	): Promise<AlbumEntry[]> {
		this.logger.debug(
			`앨범에 에셋 일괄 추가: albumId=${albumId}, count=${assetIds.length}`,
		);

		const entries: AlbumEntry[] = [];
		for (const assetId of assetIds) {
			try {
				const entry = await this.addAssetToAlbum(albumId, assetId);
				entries.push(entry);
			} catch (error) {
				this.logger.warn(
					`에셋 추가 실패: albumId=${albumId}, assetId=${assetId}`,
					error,
				);
			}
		}

		return entries;
	}

	/**
	 * 앨범에서 여러 에셋 일괄 제거
	 */
	async removeAssetsFromAlbum(
		albumId: string,
		assetIds: string[],
	): Promise<number> {
		this.logger.debug(
			`앨범에서 에셋 일괄 제거: albumId=${albumId}, count=${assetIds.length}`,
		);

		let removedCount = 0;
		for (const assetId of assetIds) {
			try {
				await this.removeAssetFromAlbum(albumId, assetId);
				removedCount++;
			} catch (error) {
				this.logger.warn(
					`에셋 제거 실패: albumId=${albumId}, assetId=${assetId}`,
					error,
				);
			}
		}

		return removedCount;
	}
}
