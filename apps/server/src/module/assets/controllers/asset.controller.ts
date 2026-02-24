import { wrapResponse } from "@cocrepo/be-common";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	AssetDto,
	AssetDetailResponseDto,
	AssetPaginationMetaDto,
	AssetQueryDto,
	AssetStatsDto,
	BatchDeleteAssetsDto,
	CreateAssetDto,
	MoveAssetDto,
	UpdateAssetDto,
	UpdateAssetStatusDto,
} from "@cocrepo/dto";
import { Asset } from "@cocrepo/entity";
import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Logger,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import { ClsService } from "nestjs-cls";
import { AssetService } from "../services/asset.service";

@ApiTags("ASSETS")
@Controller()
export class AssetController {
	private readonly logger = new Logger(AssetController.name);

	constructor(
		private readonly assetService: AssetService,
		private readonly cls: ClsService,
	) {}

	/**
	 * 현재 요청의 Space ID를 가져옵니다.
	 * X-Space-ID 헤더에서 추출됩니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new BadRequestException("Space가 선택되지 않았습니다.");
		}
		return spaceId;
	}

	@Get()
	@ApiOperation({
		operationId: "getAssets",
		summary: "에셋 목록 조회",
		description:
			"현재 Space 내의 에셋 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원하며 통계 정보도 함께 반환합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		500,
	)
	@ApiResponseEntity(AssetDto, HttpStatus.OK, {
		isArray: true,
		metaDto: AssetPaginationMetaDto,
		statsDto: AssetStatsDto,
	})
	@ResponseMessage("에셋 목록 조회 성공")
	async getAssets(@Query() query: AssetQueryDto) {
		const { assets, totalCount, stats } =
			await this.assetService.getAssetsBySpace(query);

		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		return wrapResponse(assets, {
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
			stats,
		});
	}

	@Get(":assetId")
	@ApiOperation({
		operationId: "getAssetById",
		summary: "에셋 상세 조회",
		description:
			"특정 에셋의 상세 정보를 조회합니다. Image/Video/Document 상세 정보를 포함합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "에셋을 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(AssetDetailResponseDto, HttpStatus.OK)
	@ResponseMessage("에셋 상세 조회 성공")
	async getAssetById(
		@Param("assetId", ParseUUIDPipe) assetId: string,
	): Promise<Asset> {
		return this.assetService.getAssetDetailById(assetId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createAsset",
		summary: "에셋 생성",
		description:
			"새로운 에셋을 생성합니다. 파일 업로드 완료 후 메타데이터 등록에 사용합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateAssetDto,
		description: "에셋 생성 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 400, message: "잘못된 요청 데이터입니다." },
		500,
	)
	@ApiResponseEntity(AssetDto, HttpStatus.CREATED)
	@ResponseMessage("에셋 생성 성공")
	async createAsset(@Body() dto: CreateAssetDto): Promise<Asset> {
		return this.assetService.createAsset({
			folderId: dto.folderId,
			kind: dto.kind,
			status: dto.status,
			originalName: dto.originalName,
			storageKey: dto.storageKey,
			mimeType: dto.mimeType,
			sizeBytes: BigInt(dto.sizeBytes),
			extension: dto.extension ?? null,
			checksum: dto.checksum ?? null,
			metadata: dto.metadata ?? null,
			creatorId: dto.creatorId ?? null,
		});
	}

	@Patch(":assetId")
	@ApiOperation({
		operationId: "updateAsset",
		summary: "에셋 수정",
		description:
			"에셋 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateAssetDto,
		description: "에셋 수정 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "에셋을 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(AssetDto, HttpStatus.OK)
	@ResponseMessage("에셋 수정 성공")
	async updateAsset(
		@Param("assetId", ParseUUIDPipe) assetId: string,
		@Body() dto: UpdateAssetDto,
	): Promise<Asset> {
		const updateData: Record<string, unknown> = {};

		if (dto.folderId !== undefined) updateData.folderId = dto.folderId;
		if (dto.kind !== undefined) updateData.kind = dto.kind;
		if (dto.status !== undefined) updateData.status = dto.status;
		if (dto.originalName !== undefined)
			updateData.originalName = dto.originalName;
		if (dto.storageKey !== undefined) updateData.storageKey = dto.storageKey;
		if (dto.mimeType !== undefined) updateData.mimeType = dto.mimeType;
		if (dto.sizeBytes !== undefined)
			updateData.sizeBytes = BigInt(dto.sizeBytes);
		if (dto.extension !== undefined) updateData.extension = dto.extension;
		if (dto.checksum !== undefined) updateData.checksum = dto.checksum;
		if (dto.metadata !== undefined) updateData.metadata = dto.metadata;
		if (dto.creatorId !== undefined) updateData.creatorId = dto.creatorId;

		return this.assetService.updateAsset(assetId, updateData);
	}

	@Delete(":assetId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteAsset",
		summary: "에셋 삭제",
		description: "에셋을 삭제합니다 (Soft Delete).",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "에셋을 찾을 수 없습니다." },
		500,
	)
	@ResponseMessage("에셋 삭제 성공")
	async deleteAsset(
		@Param("assetId", ParseUUIDPipe) assetId: string,
	): Promise<void> {
		await this.assetService.deleteAsset(assetId);
	}

	@Post(":assetId/restore")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "restoreAsset",
		summary: "에셋 복원",
		description:
			"삭제된 에셋을 복원합니다. 전체 접근 권한(FULL_ACCESS)이 필요합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "삭제된 에셋 복원은 전체 접근 권한이 필요합니다." },
		{ status: 404, message: "에셋을 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(AssetDto, HttpStatus.OK)
	@ResponseMessage("에셋 복원 성공")
	async restoreAsset(
		@Param("assetId", ParseUUIDPipe) assetId: string,
	): Promise<Asset> {
		return this.assetService.restoreAsset(assetId);
	}

	@Post(":assetId/move")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "moveAsset",
		summary: "에셋 이동",
		description: "에셋을 다른 폴더로 이동합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: MoveAssetDto,
		description: "이동할 대상 폴더 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 400, message: "대상 폴더를 찾을 수 없습니다." },
		{ status: 404, message: "에셋을 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(AssetDto, HttpStatus.OK)
	@ResponseMessage("에셋 이동 성공")
	async moveAsset(
		@Param("assetId", ParseUUIDPipe) assetId: string,
		@Body() dto: MoveAssetDto,
	): Promise<Asset> {
		return this.assetService.moveAsset(assetId, dto.targetFolderId);
	}

	@Patch(":assetId/status")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateAssetStatus",
		summary: "에셋 상태 변경",
		description:
			"에셋의 상태를 변경합니다. (UPLOADING, READY, FAILED)",
	})
	@ApiAuth()
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateAssetStatusDto,
		description: "변경할 상태 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "에셋을 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(AssetDto, HttpStatus.OK)
	@ResponseMessage("에셋 상태 변경 성공")
	async updateAssetStatus(
		@Param("assetId", ParseUUIDPipe) assetId: string,
		@Body() dto: UpdateAssetStatusDto,
	): Promise<Asset> {
		return this.assetService.updateAssetStatus(assetId, dto.status);
	}

	@Post("batch-delete")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "batchDeleteAssets",
		summary: "에셋 일괄 삭제",
		description:
			"여러 에셋을 한 번에 삭제합니다 (Soft Delete).",
	})
	@ApiAuth()
	@ApiBody({
		type: BatchDeleteAssetsDto,
		description: "삭제할 에셋 ID 목록",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 400, message: "일부 에셋에 대한 접근 권한이 없습니다." },
		500,
	)
	@ResponseMessage("에셋 일괄 삭제 성공")
	async batchDeleteAssets(@Body() dto: BatchDeleteAssetsDto): Promise<void> {
		await this.assetService.batchSoftDelete(dto.assetIds);
	}
}
