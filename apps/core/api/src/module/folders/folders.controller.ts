import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import { FolderDto, FolderQueryDto } from "@cocrepo/dto";
import { FolderFacade } from "@cocrepo/facade";
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("FOLDERS")
@Controller()
export class FoldersController {
	constructor(private readonly folderFacade: FolderFacade) {}

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
}
