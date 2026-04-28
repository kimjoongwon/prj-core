import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES, USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	CreateFolderDto,
	FolderDto,
	FolderQueryDto,
	UpdateFolderDto,
} from "@cocrepo/dto";
import { Folder } from "@cocrepo/entity";
import { FolderFacade } from "@cocrepo/facade";
import { AuthContext, SpaceContext } from "@cocrepo/service";
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
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("FOLDERS")
@Controller()
export class FoldersController {
	constructor(
		private readonly folderFacade: FolderFacade,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.VIEW, SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getFolders",
		summary: "폴더 목록 조회",
		description:
			"현재 선택한 Space의 폴더 목록을 조회합니다. 이름, 부모 폴더, 삭제 상태 필터를 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(400, 401, 403, 500)
	@ApiResponseEntity(FolderDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("폴더 목록 조회 성공")
	async getFolders(@Query() query: FolderQueryDto) {
		return this.folderFacade.getFolders(query);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "createFolder",
		summary: "폴더 생성",
		description:
			"현재 선택한 Space 아래에 새 폴더를 생성합니다. parentFolderId를 지정하면 하위 폴더로 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateFolderDto,
		description: "생성할 폴더 정보",
	})
	@ApiErrors(400, 401, 403, 404, 409, 500)
	@ApiResponseEntity(FolderDto, HttpStatus.CREATED)
	@ResponseMessage("폴더 생성 성공")
	async createFolder(@Body() dto: CreateFolderDto): Promise<Folder> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		return this.folderFacade.createFolder(dto, userId);
	}

	@Patch(":folderId")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "updateFolder",
		summary: "폴더 수정",
		description: "현재 선택한 Space 안에서 폴더명 또는 상위 폴더를 수정합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: UpdateFolderDto,
		description: "수정할 폴더 정보",
	})
	@ApiErrors(400, 401, 403, 404, 409, 500)
	@ApiResponseEntity(FolderDto, HttpStatus.OK)
	@ResponseMessage("폴더 수정 성공")
	async updateFolder(
		@Param("folderId", ParseUUIDPipe) folderId: string,
		@Body() dto: UpdateFolderDto,
	): Promise<Folder> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.folderFacade.updateFolder(folderId, dto);
	}

	@Delete(":folderId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "deleteFolder",
		summary: "폴더 삭제",
		description:
			"현재 선택한 Space 안에서 하위 폴더와 에셋이 없는 폴더를 삭제합니다.",
	})
	@ApiAuth()
	@ApiErrors(400, 401, 403, 404, 500)
	@ResponseMessage("폴더 삭제 성공")
	async deleteFolder(
		@Param("folderId", ParseUUIDPipe) folderId: string,
	): Promise<void> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		await this.folderFacade.deleteFolder(folderId);
	}
}
