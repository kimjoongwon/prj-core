import { RolesGuard } from "@cocrepo/be-common";
import {
	CreateRoleCommand,
	DeleteRoleCommand,
	GetRoleByIdQuery,
	GetRolesQuery,
	UpdateRoleCommand,
} from "@cocrepo/command";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import { CreateRoleDto, RoleDto, UpdateRoleDto } from "@cocrepo/dto";
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
	UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("ROLES")
@Controller()
export class RolesController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER, SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getRoles",
		summary: "역할 목록 조회",
		description: "모든 역할 목록을 조회합니다. 관리자 전용 API입니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("역할 목록 조회 성공")
	async getRoles() {
		return this.queryBus.execute(new GetRolesQuery());
	}

	@Get(":id")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER, SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getRoleById",
		summary: "역할 상세 조회",
		description: "ID로 역할을 조회합니다. 관리자 전용 API입니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "역할 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	@ResponseMessage("역할 조회 성공")
	async getRoleById(@Param("id", ParseUUIDPipe) id: string) {
		return this.queryBus.execute(new GetRoleByIdQuery(id));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "createRole",
		summary: "역할 생성",
		description:
			"새로운 역할을 생성합니다. PLATFORM_ADMIN 전용 API입니다. 역할 식별자(name)는 영문 대문자와 언더스코어만 사용 가능합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateRoleDto,
		description: "생성할 역할 정보",
	})
	@ApiErrors(400, 401, 403, 409, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.CREATED)
	@ResponseMessage("역할 생성 성공")
	async createRole(@Body() dto: CreateRoleDto) {
		return this.commandBus.execute(new CreateRoleCommand(dto));
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "updateRole",
		summary: "역할 수정",
		description:
			"역할 정보를 수정합니다. PLATFORM_ADMIN 전용 API이며, 시스템 역할(PLATFORM_ADMIN, COMPANY_MANAGER, MEMBER)은 수정할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "역할 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateRoleDto,
		description: "수정할 역할 정보 (displayName, description만 수정 가능)",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	@ResponseMessage("역할 수정 성공")
	async updateRole(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateRoleDto,
	) {
		return this.commandBus.execute(new UpdateRoleCommand(id, dto));
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "deleteRole",
		summary: "역할 삭제",
		description:
			"역할을 삭제합니다. PLATFORM_ADMIN 전용 API이며, 시스템 역할은 삭제할 수 없고, 연결된 사용자가 있으면 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "역할 ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(RoleDto, HttpStatus.OK)
	@ResponseMessage("역할 삭제 성공")
	async deleteRole(@Param("id", ParseUUIDPipe) id: string) {
		return this.commandBus.execute(new DeleteRoleCommand(id));
	}
}
