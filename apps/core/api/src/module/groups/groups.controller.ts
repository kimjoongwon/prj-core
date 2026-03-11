import { GroupsApplicationService } from "@cocrepo/app";
import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	CreateGroupDto,
	GroupDto,
	QueryGroupDto,
	UpdateGroupDto,
} from "@cocrepo/dto";
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
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("GROUPS")
@Controller()
export class GroupsController {
	constructor(
		private readonly groupsApplicationService: GroupsApplicationService,
	) {}

	@Get()
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getGroups",
		summary: "그룹 목록 조회",
		description:
			"그룹 목록을 조회합니다. type 쿼리 파라미터로 유형별 필터링이 가능합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(GroupDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("그룹 목록 조회 성공")
	async getGroups(@Query() query: QueryGroupDto) {
		return this.groupsApplicationService.getGroups(query);
	}

	@Get(":id")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getGroupById",
		summary: "그룹 상세 조회",
		description:
			"ID로 그룹을 조회합니다. 연결된 역할(RoleAssociation) 정보를 포함합니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "id", description: "그룹 ID (UUID)", type: String })
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(GroupDto, HttpStatus.OK)
	@ResponseMessage("그룹 상세 조회 성공")
	async getGroupById(@Param("id", ParseUUIDPipe) id: string) {
		return this.groupsApplicationService.getGroupById(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "createGroup",
		summary: "그룹 생성",
		description: "새로운 그룹을 생성합니다. FULL_ACCESS 전용 API입니다.",
	})
	@ApiAuth()
	@ApiBody({ type: CreateGroupDto, description: "생성할 그룹 정보" })
	@ApiErrors(400, 401, 403, 409, 500)
	@ApiResponseEntity(GroupDto, HttpStatus.CREATED)
	@ResponseMessage("그룹 생성 성공")
	async createGroup(@Body() dto: CreateGroupDto) {
		return this.groupsApplicationService.createGroup(dto);
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "updateGroup",
		summary: "그룹 수정",
		description: "그룹 정보를 수정합니다. FULL_ACCESS 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "id", description: "그룹 ID (UUID)", type: String })
	@ApiBody({ type: UpdateGroupDto, description: "수정할 그룹 정보" })
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(GroupDto, HttpStatus.OK)
	@ResponseMessage("그룹 수정 성공")
	async updateGroup(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateGroupDto,
	) {
		return this.groupsApplicationService.updateGroup(id, dto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "deleteGroup",
		summary: "그룹 삭제",
		description:
			"그룹을 삭제합니다. FULL_ACCESS 전용 API이며, 연결된 역할이 있어도 삭제됩니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "id", description: "그룹 ID (UUID)", type: String })
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(GroupDto, HttpStatus.OK)
	@ResponseMessage("그룹 삭제 성공")
	async deleteGroup(@Param("id", ParseUUIDPipe) id: string) {
		return this.groupsApplicationService.deleteGroup(id);
	}
}
