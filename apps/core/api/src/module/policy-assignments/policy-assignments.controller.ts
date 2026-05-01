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
	PolicyAssignmentResponseDto,
	SyncRolePoliciesDto,
	SyncUserPoliciesDto,
} from "@cocrepo/dto";
import { PolicyAssignmentFacade } from "@cocrepo/facade";
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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("POLICY_ASSIGNMENTS")
@Controller()
@UseGuards(RolesGuard)
export class PolicyAssignmentsController {
	constructor(
		private readonly policyAssignmentFacade: PolicyAssignmentFacade,
	) {}

	@Get("roles/:roleId")
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
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
		return this.policyAssignmentFacade.getRolePolicies(roleId);
	}

	@Put("roles/:roleId")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
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
		return this.policyAssignmentFacade.syncRolePolicies(
			roleId,
			dto.rolePolicies,
		);
	}

	@Get("users/:userId")
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getUserPolicies",
		summary: "User Policy 목록 조회",
		description: "특정 User에 직접 할당된 예외 Policy 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "userId",
		description: "User ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(PolicyAssignmentResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("사용자 정책 할당 목록 조회 성공")
	async getUserPolicies(@Param("userId", ParseUUIDPipe) userId: string) {
		return this.policyAssignmentFacade.getUserPolicies(userId);
	}

	@Put("users/:userId")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "syncUserPolicies",
		summary: "User Policy 동기화",
		description:
			"특정 User에 직접 할당할 예외 Policy 목록을 전체 동기화 방식으로 반영합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "userId",
		description: "User ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: SyncUserPoliciesDto,
		description: "User에 연결할 Policy 목록",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(PolicyAssignmentResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("사용자 정책 할당 동기화 성공")
	async syncUserPolicies(
		@Param("userId", ParseUUIDPipe) userId: string,
		@Body() dto: SyncUserPoliciesDto,
	) {
		return this.policyAssignmentFacade.syncUserPolicies(
			userId,
			dto.userPolicies,
		);
	}
}
