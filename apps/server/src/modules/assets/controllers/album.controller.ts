import { wrapResponse, type WrappedResponse } from "@cocrepo/be-common";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	AddAssetsToAlbumDto,
	AlbumDetailResponseDto,
	AlbumDto,
	AlbumPaginationMetaDto,
	AlbumQueryDto,
	CreateAlbumDto,
	UpdateAlbumDto,
} from "@cocrepo/dto";
import { EntryOrderItem, ReorderAlbumEntriesDto } from "@cocrepo/dto";
import { Album } from "@cocrepo/entity";
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
import { AlbumService } from "../services/album.service";

/** 앨범 목록 페이지네이션 메타 타입 */
type AlbumListMeta = {
	total: number;
	skip: number;
	take: number;
	totalPages: number;
};

@ApiTags("ALBUMS")
@Controller("albums")
export class AlbumController {
	private readonly logger = new Logger(AlbumController.name);

	constructor(
		private readonly albumService: AlbumService,
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
		operationId: "getAlbums",
		summary: "앨범 목록 조회",
		description:
			"현재 Space 내의 앨범 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.OK, {
		isArray: true,
		metaDto: AlbumPaginationMetaDto,
	})
	@ResponseMessage("앨범 목록 조회 성공")
	async getAlbums(@Query() query: AlbumQueryDto): Promise<WrappedResponse<Album[], AlbumListMeta>> {
		const { albums, totalCount } = await this.albumService.getAlbumsBySpace(query);

		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		return wrapResponse(albums, {
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
		});
	}

	@Get(":albumId")
	@ApiOperation({
		operationId: "getAlbumById",
		summary: "앨범 상세 조회",
		description:
			"특정 앨범의 상세 정보를 조회합니다. 앨범에 포함된 엔트리 목록을 함께 반환합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "앨범을 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(AlbumDetailResponseDto, HttpStatus.OK)
	@ResponseMessage("앨범 상세 조회 성공")
	async getAlbumById(
		@Param("albumId", ParseUUIDPipe) albumId: string,
	): Promise<Album> {
		return this.albumService.getAlbumDetailById(albumId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createAlbum",
		summary: "앨범 생성",
		description: "새로운 앨범을 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateAlbumDto,
		description: "앨범 생성 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 400, message: "잘못된 요청 데이터입니다." },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.CREATED)
	@ResponseMessage("앨범 생성 성공")
	async createAlbum(@Body() dto: CreateAlbumDto): Promise<Album> {
		return this.albumService.createAlbum({
			name: dto.name,
			description: dto.description ?? null,
			sortOrder: dto.sortOrder,
			coverAssetId: dto.coverAssetId ?? null,
		});
	}

	@Patch(":albumId")
	@ApiOperation({
		operationId: "updateAlbum",
		summary: "앨범 수정",
		description:
			"앨범 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateAlbumDto,
		description: "앨범 수정 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "앨범을 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.OK)
	@ResponseMessage("앨범 수정 성공")
	async updateAlbum(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Body() dto: UpdateAlbumDto,
	): Promise<Album> {
		const updateData: Record<string, unknown> = {};

		if (dto.name !== undefined) updateData.name = dto.name;
		if (dto.description !== undefined) updateData.description = dto.description;
		if (dto.sortOrder !== undefined) updateData.sortOrder = dto.sortOrder;
		if (dto.coverAssetId !== undefined) updateData.coverAssetId = dto.coverAssetId;

		return this.albumService.updateAlbum(albumId, updateData);
	}

	@Delete(":albumId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteAlbum",
		summary: "앨범 삭제",
		description: "앨범을 삭제합니다 (Soft Delete).",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "앨범을 찾을 수 없습니다." },
		500,
	)
	@ResponseMessage("앨범 삭제 성공")
	async deleteAlbum(
		@Param("albumId", ParseUUIDPipe) albumId: string,
	): Promise<void> {
		await this.albumService.deleteAlbum(albumId);
	}

	@Post(":albumId/restore")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "restoreAlbum",
		summary: "앨범 복원",
		description:
			"삭제된 앨범을 복원합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 404, message: "앨범을 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.OK)
	@ResponseMessage("앨범 복원 성공")
	async restoreAlbum(
		@Param("albumId", ParseUUIDPipe) albumId: string,
	): Promise<Album> {
		return this.albumService.restoreAlbum(albumId);
	}

	@Post(":albumId/entries")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "addAssetsToAlbum",
		summary: "앨범에 에셋 추가",
		description:
			"앨범에 하나 이상의 에셋을 엔트리로 추가합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: AddAssetsToAlbumDto,
		description: "추가할 에셋 ID 목록",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "앨범을 찾을 수 없습니다." },
		{ status: 400, message: "일부 에셋을 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.OK)
	@ResponseMessage("앨범에 에셋 추가 성공")
	async addAssetsToAlbum(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Body() dto: AddAssetsToAlbumDto,
	): Promise<Album> {
		await this.albumService.addAssetsToAlbum(albumId, dto.assetIds);
		return this.albumService.getAlbumDetailById(albumId);
	}

	@Delete(":albumId/entries/:assetId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "removeAssetFromAlbum",
		summary: "앨범에서 에셋 제거",
		description:
			"앨범에서 특정 에셋을 제거합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiParam({
		name: "assetId",
		description: "에셋 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "앨범을 찾을 수 없습니다." },
		{ status: 404, message: "엔트리를 찾을 수 없습니다." },
		500,
	)
	@ResponseMessage("앨범에서 에셋 제거 성공")
	async removeAssetFromAlbum(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Param("assetId", ParseUUIDPipe) assetId: string,
	): Promise<void> {
		await this.albumService.removeAssetFromAlbum(albumId, assetId);
	}

	@Patch(":albumId/entries/reorder")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "reorderAlbumEntries",
		summary: "앨범 엔트리 순서 변경",
		description:
			"앨범 내 엔트리의 표시 순서를 변경합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: ReorderAlbumEntriesDto,
		description: "순서 변경 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "앨범을 찾을 수 없습니다." },
		{ status: 400, message: "잘못된 엔트리 ID가 포함되어 있습니다." },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.OK)
	@ResponseMessage("앨범 엔트리 순서 변경 성공")
	async reorderAlbumEntries(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Body() dto: ReorderAlbumEntriesDto,
	): Promise<Album> {
		// EntryOrderItem의 entryId를 assetId로 매핑
		const entryPositions = dto.entries.map((item: EntryOrderItem) => ({
			assetId: item.entryId,
			position: item.position,
		}));
		await this.albumService.reorderAlbumEntries(albumId, entryPositions);
		return this.albumService.getAlbumDetailById(albumId);
	}
}
