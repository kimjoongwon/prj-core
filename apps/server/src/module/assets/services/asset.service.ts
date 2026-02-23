import { canAccessAllSpaces } from "@cocrepo/be-common";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { AssetQueryDto } from "@cocrepo/dto";
import type { Prisma } from "@cocrepo/prisma";
import { Asset } from "@cocrepo/entity";
import type { AssetStats } from "@cocrepo/type";
import {
	BadRequestException,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { AssetRepository } from "../repositories/asset.repository";

/**
 * 에셋 목록 조회 결과
 */
export interface GetAssetsResult {
	assets: Asset[];
	totalCount: number;
	stats: AssetStats;
}

/**
 * 에셋 서비스
 *
 * 에셋 CRUD 및 비즈니스 로직을 담당합니다.
 * Space 기반 접근 권한을 검증합니다.
 */
@Injectable()
export class AssetService {
	private readonly logger = new Logger(AssetService.name);

	constructor(
		private readonly repository: AssetRepository,
		private readonly cls: ClsService,
	) {}

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
	 * 접근 가능한 Space 내 에셋 목록 조회
	 */
	async getAssetsBySpace(query: AssetQueryDto): Promise<GetAssetsResult> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`Space 내 에셋 목록 조회: spaceId=${spaceId}`);

		// 전체 접근 권한이 있고 query에 spaceId가 있으면 해당 spaceId 사용
		const targetSpaceId =
			this.canAccessAllSpaces() && query.spaceId
				? query.spaceId
				: spaceId;

		const baseWhere: Partial<Prisma.AssetWhereInput> = {
			spaceId: targetSpaceId,
		};

		const where = query.toPrismaWhere(baseWhere);
		const orderBy = query.toPrismaOrderBy();

		const [{ items, count }, stats] = await Promise.all([
			this.repository.findManyBySpaceId({
				spaceId: targetSpaceId,
				where,
				orderBy,
				skip: query.skip ?? 0,
				take: query.take ?? 10,
			}),
			this.getAssetStats(targetSpaceId),
		]);

		return {
			assets: items,
			totalCount: count,
			stats,
		};
	}

	/**
	 * 에셋 상세 조회 (Image/Video/Document 포함)
	 */
	async getAssetDetailById(assetId: string): Promise<Asset> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`에셋 상세 조회: assetId=${assetId}, spaceId=${spaceId}`,
		);

		const asset = await this.repository.findByIdWithDetails(assetId);

		if (!asset) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		// Space 접근 권한 확인
		if (!this.canAccessAllSpaces() && asset.spaceId !== spaceId) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		return asset;
	}

	/**
	 * ID로 에셋 조회
	 */
	async getAssetById(assetId: string): Promise<Asset | null> {
		this.logger.debug(`ID로 에셋 조회: assetId=${assetId}`);
		return this.repository.findById(assetId);
	}

	/**
	 * Storage Key로 에셋 조회
	 */
	async getAssetByStorageKey(storageKey: string): Promise<Asset | null> {
		this.logger.debug(`Storage Key로 에셋 조회: ${storageKey}`);
		return this.repository.findByStorageKey(storageKey);
	}

	/**
	 * 에셋 생성
	 */
	async createAsset(
		data: Prisma.AssetUncheckedCreateInput,
	): Promise<Asset> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`에셋 생성: spaceId=${spaceId}`);

		return this.repository.create({
			...data,
			spaceId,
		});
	}

	/**
	 * 에셋 생성 (상세 정보와 함께)
	 */
	async createAssetWithDetails(params: {
		asset: Prisma.AssetUncheckedCreateInput;
		image?: Prisma.ImageUncheckedCreateInput;
		video?: Prisma.VideoUncheckedCreateInput;
		document?: Prisma.DocumentUncheckedCreateInput;
	}): Promise<Asset> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`에셋 생성 (상세 포함): spaceId=${spaceId}`);

		return this.repository.createWithDetails({
			asset: {
				...params.asset,
				spaceId,
			},
			image: params.image,
			video: params.video,
			document: params.document,
		});
	}

	/**
	 * 에셋 수정
	 */
	async updateAsset(
		assetId: string,
		data: Prisma.AssetUncheckedUpdateInput,
	): Promise<Asset> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`에셋 수정: assetId=${assetId}, spaceId=${spaceId}`);

		// 에셋 존재 및 권한 확인
		const asset = await this.repository.findById(assetId);
		if (!asset) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		if (!this.canAccessAllSpaces() && asset.spaceId !== spaceId) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		return this.repository.updateById(assetId, data);
	}

	/**
	 * 에셋 삭제 (Soft Delete)
	 */
	async deleteAsset(assetId: string): Promise<Asset> {
		const spaceId = this.getSpaceId();
		this.logger.debug(`에셋 삭제: assetId=${assetId}, spaceId=${spaceId}`);

		// 에셋 존재 및 권한 확인
		const asset = await this.repository.findById(assetId);
		if (!asset) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		if (!this.canAccessAllSpaces() && asset.spaceId !== spaceId) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		return this.repository.removeById(assetId);
	}

	/**
	 * 일괄 소프트 삭제
	 */
	async batchSoftDelete(assetIds: string[]): Promise<number> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`일괄 에셋 삭제: count=${assetIds.length}, spaceId=${spaceId}`,
		);

		// 전체 접근 권한이 없으면 해당 Space의 에셋만 삭제
		if (!this.canAccessAllSpaces()) {
			const assets = await this.repository.findByIds(assetIds);
			const invalidAssets = assets.filter((a) => a.spaceId !== spaceId);
			if (invalidAssets.length > 0) {
				throw new BadRequestException(
					"일부 에셋에 대한 접근 권한이 없습니다.",
				);
			}
		}

		let deletedCount = 0;
		for (const id of assetIds) {
			try {
				await this.repository.removeById(id);
				deletedCount++;
			} catch (error) {
				this.logger.warn(`에셋 삭제 실패: id=${id}`, error);
			}
		}

		return deletedCount;
	}

	/**
	 * 에셋 복원
	 */
	async restoreAsset(assetId: string): Promise<Asset> {
		this.logger.debug(`에셋 복원: assetId=${assetId}`);

		// 전체 접근 권한이 있는 경우에만 복원 가능
		if (!this.canAccessAllSpaces()) {
			throw new BadRequestException(
				"삭제된 에셋 복원은 전체 접근 권한이 필요합니다.",
			);
		}

		return this.repository.restoreById(assetId);
	}

	/**
	 * 에셋 이동 (폴더 변경)
	 */
	async moveAsset(
		assetId: string,
		targetFolderId: string,
	): Promise<Asset> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`에셋 이동: assetId=${assetId} -> folderId=${targetFolderId}`,
		);

		// 에셋 존재 및 권한 확인
		const asset = await this.repository.findById(assetId);
		if (!asset) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		if (!this.canAccessAllSpaces() && asset.spaceId !== spaceId) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		// TODO: 대상 폴더 존재 및 같은 Space 확인 (FolderRepository 필요)
		// const targetFolder = await this.folderRepository.findById(targetFolderId);
		// if (!targetFolder || targetFolder.spaceId !== spaceId) {
		//   throw new BadRequestException("대상 폴더를 찾을 수 없습니다.");
		// }

		return this.repository.moveById(assetId, targetFolderId);
	}

	/**
	 * 에셋 상태 변경
	 */
	async updateAssetStatus(
		assetId: string,
		status: Prisma.AssetUncheckedUpdateInput["status"],
	): Promise<Asset> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`에셋 상태 변경: assetId=${assetId}, status=${status}`,
		);

		// 에셋 존재 및 권한 확인
		const asset = await this.repository.findById(assetId);
		if (!asset) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		if (!this.canAccessAllSpaces() && asset.spaceId !== spaceId) {
			throw new NotFoundException("에셋을 찾을 수 없습니다.");
		}

		return this.repository.updateById(assetId, { status });
	}

	/**
	 * 여러 ID로 에셋 목록 조회
	 */
	async getAssetsByIds(ids: string[]): Promise<Asset[]> {
		this.logger.debug(`여러 ID로 에셋 조회: count=${ids.length}`);
		return this.repository.findByIds(ids);
	}

	/**
	 * Folder ID로 에셋 목록 조회
	 */
	async getAssetsByFolderId(
		folderId: string,
		query?: AssetQueryDto,
	): Promise<{ items: Asset[]; count: number }> {
		this.logger.debug(`Folder ID로 에셋 목록 조회: folderId=${folderId}`);

		const where = query?.toPrismaWhere({ folderId });
		const orderBy = query?.toPrismaOrderBy();

		return this.repository.findManyByFolderId({
			folderId,
			where,
			orderBy,
			skip: query?.skip ?? 0,
			take: query?.take ?? 10,
		});
	}

	/**
	 * Space ID로 에셋 수 조회
	 */
	async countAssetsBySpaceId(spaceId: string): Promise<number> {
		this.logger.debug(`Space ID로 에셋 수 조회: spaceId=${spaceId}`);
		return this.repository.countBySpaceId(spaceId);
	}

	/**
	 * Folder ID로 에셋 수 조회
	 */
	async countAssetsByFolderId(folderId: string): Promise<number> {
		this.logger.debug(`Folder ID로 에셋 수 조회: folderId=${folderId}`);
		return this.repository.countByFolderId(folderId);
	}

	/**
	 * 에셋 통계 조회
	 */
	private async getAssetStats(spaceId: string): Promise<AssetStats> {
		// TODO: 실제 통계 로직 구현 (kind별 count, 전체 size 합계)
		// 현재는 기본값 반환
		const total = await this.repository.countBySpaceId(spaceId);
		return {
			total,
			images: 0,
			videos: 0,
			documents: 0,
			totalSize: 0,
		};
	}

	/**
	 * 에셋 검색 (키워드 기반)
	 */
	async searchAssets(
		keyword: string,
		query?: AssetQueryDto,
	): Promise<GetAssetsResult> {
		const spaceId = this.getSpaceId();
		this.logger.debug(
			`에셋 검색: keyword=${keyword}, spaceId=${spaceId}`,
		);

		const searchQuery = new AssetQueryDto();
		Object.assign(searchQuery, query);
		searchQuery.search = keyword;

		return this.getAssetsBySpace(searchQuery);
	}
}
