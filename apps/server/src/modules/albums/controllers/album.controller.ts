import { wrapResponse, type WrappedResponse } from "@cocrepo/be-common";
import { CONTEXT_KEYS, USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	AddAssetsToAlbumDto,
	AlbumDto,
	AlbumEntryDto,
	AlbumQueryDto,
	CreateAlbumDto,
	ReorderAlbumEntriesDto,
	UpdateAlbumDto,
	UpdateAlbumEntryDto,
} from "@cocrepo/dto";
import { Album, AlbumEntry } from "@cocrepo/entity";
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { ClsService } from "nestjs-cls";
import { PinoLogger } from "nestjs-pino";

/** 앨범 목록 페이지네이션 메타 타입 */
type AlbumListMeta = {
	total: number;
	skip: number;
	take: number;
};

@ApiTags("ALBUMS")
@Controller()
export class AlbumController {
	constructor(
		private readonly logger: PinoLogger,
		private readonly cls: ClsService,
	) {
		this.logger.setContext(AlbumController.name);
	}

	/**
	 * 현재 요청의 Space ID를 가져옵니다.
	 * X-Space-ID 헤더에서 추출됩니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}
		return spaceId;
	}

	// ============================================================================
	// 앨범 CRUD
	// ============================================================================

	@Get()
	@ApiOperation({
		operationId: "getAlbums",
		summary: "앨범 목록 조회",
		description:
			"현재 Space 내의 앨범 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("앨범 목록 조회 성공")
	async getAlbums(@Query() query: AlbumQueryDto): Promise<WrappedResponse<Album[], AlbumListMeta>> {
		const spaceId = this.getSpaceId();
		this.logger.info({ spaceId, query }, "Getting albums");

		// TODO: AlbumService 구현 후 연결
		// const { albums, totalCount } = await this.albumService.findBySpace(spaceId, query);
		// const skip = query.skip ?? 0;
		// const take = query.take ?? 20;
		// return wrapResponse(albums, {
		//   meta: { total: totalCount, skip, take },
		// });

		return wrapResponse([], {
			meta: { total: 0, skip: query.skip ?? 0, take: query.take ?? 20 },
		});
	}

	@Get(":albumId")
	@ApiOperation({
		operationId: "getAlbumById",
		summary: "앨범 상세 조회",
		description: "특정 앨범의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "앨범을 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.OK)
	@ResponseMessage("앨범 상세 조회 성공")
	async getAlbumById(
		@Param("albumId", ParseUUIDPipe) albumId: string,
	): Promise<Album> {
		const spaceId = this.getSpaceId();
		this.logger.info({ spaceId, albumId }, "Getting album by id");

		// TODO: AlbumService 구현 후 연결
		// return this.albumService.findById(albumId, spaceId);

		throw new Error("AlbumService not implemented");
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createAlbum",
		summary: "앨범 생성",
		description:
			"새로운 앨범을 생성합니다. 이름은 Space 내에서 유니크해야 합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateAlbumDto,
		description: "앨범 생성 정보",
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 409, message: "이미 존재하는 앨범명입니다" },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.CREATED)
	@ResponseMessage("앨범 생성 성공")
	async createAlbum(@Body() dto: CreateAlbumDto): Promise<Album> {
		const spaceId = this.getSpaceId();
		this.logger.info({ spaceId, name: dto.name }, "Creating album");

		// TODO: AlbumService 구현 후 연결
		// return this.albumService.create({ ...dto, spaceId });

		throw new Error("AlbumService not implemented");
	}

	@Patch(":albumId")
	@ApiOperation({
		operationId: "updateAlbum",
		summary: "앨범 수정",
		description: "앨범 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다.",
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
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "앨범을 찾을 수 없습니다" },
		{ status: 409, message: "이미 존재하는 앨범명입니다" },
		500,
	)
	@ApiResponseEntity(AlbumDto, HttpStatus.OK)
	@ResponseMessage("앨범 수정 성공")
	async updateAlbum(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Body() dto: UpdateAlbumDto,
	): Promise<Album> {
		const spaceId = this.getSpaceId();
		this.logger.info({ spaceId, albumId, dto }, "Updating album");

		// TODO: AlbumService 구현 후 연결
		// return this.albumService.update(albumId, spaceId, dto);

		throw new Error("AlbumService not implemented");
	}

	@Delete(":albumId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteAlbum",
		summary: "앨범 삭제",
		description:
			"앨범을 삭제합니다 (Soft Delete). 연결된 엔트리도 함께 삭제됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "앨범을 찾을 수 없습니다" },
		500,
	)
	@ResponseMessage("앨범 삭제 성공")
	async deleteAlbum(
		@Param("albumId", ParseUUIDPipe) albumId: string,
	): Promise<void> {
		const spaceId = this.getSpaceId();
		this.logger.info({ spaceId, albumId }, "Deleting album");

		// TODO: AlbumService 구현 후 연결
		// await this.albumService.softDelete(albumId, spaceId);
	}

	// ============================================================================
	// 앨범 엔트리 관리
	// ============================================================================

	@Get(":albumId/entries")
	@ApiOperation({
		operationId: "getAlbumEntries",
		summary: "앨범 엔트리 목록 조회",
		description:
			"앨범에 포함된 엔트리 목록을 조회합니다. 에셋 정보가 포함됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "앨범을 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(AlbumEntryDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("엔트리 목록 조회 성공")
	async getAlbumEntries(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Query() query: { skip?: number; take?: number },
	): Promise<{ data: AlbumEntry[] }> {
		const spaceId = this.getSpaceId();
		this.logger.info({ spaceId, albumId, query }, "Getting album entries");

		// TODO: AlbumService 구현 후 연결
		// const entries = await this.albumService.getEntries(albumId, spaceId, query);
		// return { data: entries };

		return { data: [] };
	}

	@Post(":albumId/entries")
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "addAssetsToAlbum",
		summary: "앨범에 에셋 추가",
		description:
			"앨범에 하나 이상의 에셋을 추가합니다. 이미 포함된 에셋은 추가할 수 없습니다.",
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
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "앨범을 찾을 수 없습니다" },
		{ status: 404, message: "에셋을 찾을 수 없습니다" },
		{ status: 409, message: "이미 앨범에 포함된 에셋입니다" },
		500,
	)
	@ApiResponseEntity(AlbumEntryDto, HttpStatus.CREATED, { isArray: true })
	@ResponseMessage("에셋 추가 성공")
	async addAssetsToAlbum(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Body() dto: AddAssetsToAlbumDto,
	): Promise<AlbumEntry[]> {
		const spaceId = this.getSpaceId();
		this.logger.info(
			{ spaceId, albumId, assetCount: dto.assetIds.length },
			"Adding assets to album",
		);

		// TODO: AlbumService 구현 후 연결
		// return this.albumService.addAssets(albumId, spaceId, dto.assetIds);

		return [];
	}

	@Delete(":albumId/entries/:entryId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "removeAlbumEntry",
		summary: "앨범에서 엔트리 제거",
		description: "앨범에서 특정 엔트리를 제거합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiParam({
		name: "entryId",
		description: "엔트리 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "앨범을 찾을 수 없습니다" },
		{ status: 404, message: "엔트리를 찾을 수 없습니다" },
		500,
	)
	@ResponseMessage("엔트리 제거 성공")
	async removeAlbumEntry(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Param("entryId", ParseUUIDPipe) entryId: string,
	): Promise<void> {
		const spaceId = this.getSpaceId();
		this.logger.info({ spaceId, albumId, entryId }, "Removing album entry");

		// TODO: AlbumService 구현 후 연결
		// await this.albumService.removeEntry(albumId, spaceId, entryId);
	}

	@Patch(":albumId/entries/reorder")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "reorderAlbumEntries",
		summary: "앨범 엔트리 순서 변경",
		description:
			"앨범 내 엔트리의 표시 순서를 변경합니다. 모든 entryId가 해당 앨범에 속해야 하며 중복될 수 없습니다.",
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
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "앨범을 찾을 수 없습니다" },
		{ status: 400, message: "중복된 엔트리 ID가 있습니다" },
		{ status: 400, message: "앨범에 속하지 않은 엔트리가 있습니다" },
		500,
	)
	@ResponseMessage("순서 변경 성공")
	async reorderAlbumEntries(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Body() dto: ReorderAlbumEntriesDto,
	): Promise<void> {
		const spaceId = this.getSpaceId();
		this.logger.info(
			{ spaceId, albumId, entryCount: dto.entries.length },
			"Reordering album entries",
		);

		// TODO: AlbumService 구현 후 연결
		// await this.albumService.reorderEntries(albumId, spaceId, dto.entries);
	}

	@Patch(":albumId/entries/:entryId")
	@ApiOperation({
		operationId: "updateAlbumEntry",
		summary: "앨범 엔트리 수정",
		description: "앨범 엔트리의 캡션 등을 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "albumId",
		description: "앨범 ID (UUID)",
		type: String,
	})
	@ApiParam({
		name: "entryId",
		description: "엔트리 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateAlbumEntryDto,
		description: "엔트리 수정 정보",
	})
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		{ status: 404, message: "앨범을 찾을 수 없습니다" },
		{ status: 404, message: "엔트리를 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(AlbumEntryDto, HttpStatus.OK)
	@ResponseMessage("엔트리 수정 성공")
	async updateAlbumEntry(
		@Param("albumId", ParseUUIDPipe) albumId: string,
		@Param("entryId", ParseUUIDPipe) entryId: string,
		@Body() dto: UpdateAlbumEntryDto,
	): Promise<AlbumEntry> {
		const spaceId = this.getSpaceId();
		this.logger.info(
			{ spaceId, albumId, entryId, caption: dto.caption },
			"Updating album entry",
		);

		// TODO: AlbumService 구현 후 연결
		// return this.albumService.updateCaption(albumId, spaceId, entryId, dto.caption);

		throw new Error("AlbumService not implemented");
	}
}
