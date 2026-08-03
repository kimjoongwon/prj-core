import { ParseBigIntIdPipe, RolesGuard } from "@cocrepo/be-common";
import {
	GetRoleAssignmentsQuery,
	SyncRoleAssignmentsCommand,
} from "@cocrepo/command";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	RoleAssignmentResponseDto,
	SyncRoleAssignmentsDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Put,
	UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("ROLE_ASSIGNMENTS")
@Controller()
@UseGuards(RolesGuard)
export class RoleAssignmentsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get(":roleId/assignments")
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getRoleAssignments",
		summary: "Role 정책 할당 목록 조회",
		description: "특정 Role에 할당된 Policy 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "roleId",
		description: "Role ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(RoleAssignmentResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("역할 정책 할당 목록 조회 성공")
	async getRoleAssignments(@Param("roleId", ParseBigIntIdPipe) roleId: bigint) {
		return this.queryBus.execute(new GetRoleAssignmentsQuery(roleId));
	}

	@Put(":roleId/assignments")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "syncRoleAssignments",
		summary: "Role 정책 할당 동기화",
		description:
			"특정 Role에 할당할 Policy 목록을 전체 동기화 방식으로 반영합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "roleId",
		description: "Role ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiBody({
		type: SyncRoleAssignmentsDto,
		description: "Role에 연결할 Policy 목록",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(RoleAssignmentResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("역할 정책 할당 동기화 성공")
	async syncRoleAssignments(
		@Param("roleId", ParseBigIntIdPipe) roleId: bigint,
		@Body() dto: SyncRoleAssignmentsDto,
	) {
		return this.commandBus.execute(
			new SyncRoleAssignmentsCommand(roleId, {
				assignments: dto.assignments,
			}),
		);
	}
}
