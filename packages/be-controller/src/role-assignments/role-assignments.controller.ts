import { RolesGuard } from "@cocrepo/be-common";
import {
	GetRolePoliciesQuery,
	SyncRolePoliciesCommand,
} from "@cocrepo/command";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import { PolicyAssignmentResponseDto, SyncRolePoliciesDto } from "@cocrepo/dto";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Put,
	UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("POLICY_ASSIGNMENTS")
@Controller()
@UseGuards(RolesGuard)
export class PolicyAssignmentsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get("roles/:roleId")
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getRolePolicies",
		summary: "Role Policy 목록 조회",
		description: "특정 Role에 할당된 Policy 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "roleId",
		description: "Role ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(PolicyAssignmentResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("역할 정책 할당 목록 조회 성공")
	async getRolePolicies(@Param("roleId", ParseUUIDPipe) roleId: string) {
		return this.queryBus.execute(new GetRolePoliciesQuery(roleId));
	}

	@Put("roles/:roleId")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "syncRolePolicies",
		summary: "Role Policy 동기화",
		description:
			"특정 Role에 할당할 Policy 목록을 전체 동기화 방식으로 반영합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "roleId",
		description: "Role ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: SyncRolePoliciesDto,
		description: "Role에 연결할 Policy 목록",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(PolicyAssignmentResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("역할 정책 할당 동기화 성공")
	async syncRolePolicies(
		@Param("roleId", ParseUUIDPipe) roleId: string,
		@Body() dto: SyncRolePoliciesDto,
	) {
		return this.commandBus.execute(
			new SyncRolePoliciesCommand(roleId, { rolePolicies: dto.rolePolicies }),
		);
	}
}
