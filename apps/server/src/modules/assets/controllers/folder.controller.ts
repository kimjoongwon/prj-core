import { wrapResponse } from "@cocrepo/be-common";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreateFolderDto,
	FolderDetailResponseDto,
	FolderDto,
	FolderQueryDto,
	MoveFolderDto,
	UpdateFolderDto,
} from "@cocrepo/dto";
import { Folder } from "@cocrepo/entity";
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
import { FolderService } from "../services/folder.service";

@ApiTags("FOLDERS")
@Controller("folders")
export class FolderController {
	private readonly logger = new Logger(FolderController.name);

	constructor(
		private readonly folderService: FolderService,
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
		operationId: "getFolders",
		summary: "폴더 목록 조회",
		description:
			"현재 Space 내의 폴더 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		500,
	)
	@ApiResponseEntity(FolderDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("폴더 목록 조회 성공")
	async getFolders(@Query() query: FolderQueryDto) {
		const { folders, totalCount } =
			await this.folderService.getFoldersBySpace(query);

		const skip = query.skip ?? 0;
		const take = query.take ?? 10;

		return wrapResponse(folders, {
			meta: {
				total: totalCount,
				skip,
				take,
				totalPages: take > 0 ? Math.ceil(totalCount / take) : 1,
			},
		});
	}

	@Get("tree")
	@ApiOperation({
		operationId: "getFolderTree",
		summary: "폴더 트리 조회",
		description:
			"현재 Space 내의 폴더 계층 구조를 트리 형태로 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		500,
	)
	@ApiResponseEntity(FolderDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("폴더 트리 조회 성공")
	async getFolderTree(): Promise<Folder[]> {
		const spaceId = this.getSpaceId();
		return this.folderService.getFolderTree(spaceId);
	}

	@Get(":folderId")
	@ApiOperation({
		operationId: "getFolderById",
		summary: "폴더 상세 조회",
		description: "특정 폴더의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "folderId",
		description: "폴더 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "폴더를 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(FolderDetailResponseDto, HttpStatus.OK)
	@ResponseMessage("폴더 상세 조회 성공")
	async getFolderById(
		@Param("folderId", ParseUUIDPipe) folderId: string,
	): Promise<Folder> {
		return this.folderService.getFolderById(folderId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createFolder",
		summary: "폴더 생성",
		description: "새로운 폴더를 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateFolderDto,
		description: "폴더 생성 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 400, message: "잘못된 요청 데이터입니다." },
		{ status: 400, message: "동일한 이름의 폴더가 이미 존재합니다." },
		500,
	)
	@ApiResponseEntity(FolderDto, HttpStatus.CREATED)
	@ResponseMessage("폴더 생성 성공")
	async createFolder(@Body() dto: CreateFolderDto): Promise<Folder> {
		return this.folderService.createFolder(dto);
	}

	@Patch(":folderId")
	@ApiOperation({
		operationId: "updateFolder",
		summary: "폴더 수정",
		description:
			"폴더 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "folderId",
		description: "폴더 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateFolderDto,
		description: "폴더 수정 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "폴더를 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(FolderDto, HttpStatus.OK)
	@ResponseMessage("폴더 수정 성공")
	async updateFolder(
		@Param("folderId", ParseUUIDPipe) folderId: string,
		@Body() dto: UpdateFolderDto,
	): Promise<Folder> {
		// 이름 변경이 있으면 renameFolder 호출
		if (dto.name !== undefined) {
			return this.folderService.renameFolder(folderId, dto.name);
		}

		// 정렬 순서 변경이 있으면 updateFolderSortOrder 호출
		if (dto.sortOrder !== undefined) {
			return this.folderService.updateFolderSortOrder(
				folderId,
				dto.sortOrder,
			);
		}

		// 변경 사항이 없으면 현재 폴더 반환
		return this.folderService.getFolderById(folderId);
	}

	@Delete(":folderId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteFolder",
		summary: "폴더 삭제",
		description: "폴더를 삭제합니다 (Soft Delete).",
	})
	@ApiAuth()
	@ApiParam({
		name: "folderId",
		description: "폴더 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 404, message: "폴더를 찾을 수 없습니다." },
		500,
	)
	@ResponseMessage("폴더 삭제 성공")
	async deleteFolder(
		@Param("folderId", ParseUUIDPipe) folderId: string,
	): Promise<void> {
		await this.folderService.deleteFolder(folderId);
	}

	@Post(":folderId/restore")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "restoreFolder",
		summary: "폴더 복원",
		description:
			"삭제된 폴더를 복원합니다. 전체 접근 권한(FULL_ACCESS)이 필요합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "folderId",
		description: "폴더 ID (UUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "삭제된 폴더 복원은 전체 접근 권한이 필요합니다." },
		{ status: 404, message: "폴더를 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(FolderDto, HttpStatus.OK)
	@ResponseMessage("폴더 복원 성공")
	async restoreFolder(
		@Param("folderId", ParseUUIDPipe) folderId: string,
	): Promise<Folder> {
		return this.folderService.restoreFolder(folderId);
	}

	@Post(":folderId/move")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "moveFolder",
		summary: "폴더 이동",
		description:
			"폴더를 다른 상위 폴더로 이동합니다. targetFolderId가 null이면 루트로 이동합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "folderId",
		description: "폴더 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: MoveFolderDto,
		description: "이동할 대상 폴더 정보",
	})
	@ApiErrors(
		{ status: 401, message: "인증이 필요합니다." },
		{ status: 400, message: "Space가 선택되지 않았습니다." },
		{ status: 400, message: "대상 폴더를 찾을 수 없습니다." },
		{ status: 400, message: "자신의 하위 폴더로 이동할 수 없습니다." },
		{ status: 404, message: "폴더를 찾을 수 없습니다." },
		500,
	)
	@ApiResponseEntity(FolderDto, HttpStatus.OK)
	@ResponseMessage("폴더 이동 성공")
	async moveFolder(
		@Param("folderId", ParseUUIDPipe) folderId: string,
		@Body() dto: MoveFolderDto,
	): Promise<Folder> {
		return this.folderService.moveFolder(folderId, dto.targetFolderId);
	}
}
