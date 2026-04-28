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
	CreatePolicyDto,
	PolicyAbilityResponseDto,
	PolicyResponseDto,
	SyncPolicyAbilitiesDto,
	UpdatePolicyDto,
} from "@cocrepo/dto";
import { PolicyFacade } from "@cocrepo/facade";
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
	Put,
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("POLICIES")
@Controller()
@UseGuards(RolesGuard)
export class PoliciesController {
	constructor(private readonly policyFacade: PolicyFacade) {}

	@Get()
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getPolicies",
		summary: "Policy 목록 조회",
		description: "Policy 기반 권한 정책 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(PolicyResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("common.policy.list.success")
	async getPolicies() {
		return this.policyFacade.listPolicies();
	}

	@Get(":policyId")
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "getPolicyById",
		summary: "Policy 상세 조회",
		description: "ID로 특정 Policy를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "policyId",
		description: "Policy ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(PolicyResponseDto, HttpStatus.OK)
	@ResponseMessage("common.policy.read.success")
	async getPolicyById(@Param("policyId", ParseUUIDPipe) policyId: string) {
		return this.policyFacade.getPolicyById(policyId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "createPolicy",
		summary: "Policy 생성",
		description: "재사용 가능한 권한 정책 묶음을 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreatePolicyDto,
		description: "생성할 Policy 데이터",
	})
	@ApiErrors(400, 401, 403, 500)
	@ApiResponseEntity(PolicyResponseDto, HttpStatus.CREATED)
	@ResponseMessage("common.policy.create.success")
	async createPolicy(@Body() dto: CreatePolicyDto) {
		return this.policyFacade.createPolicy(dto);
	}

	@Patch(":policyId")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "updatePolicy",
		summary: "Policy 수정",
		description: "기존 Policy 정보를 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "policyId",
		description: "Policy ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdatePolicyDto,
		description: "수정할 Policy 데이터",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(PolicyResponseDto, HttpStatus.OK)
	@ResponseMessage("common.policy.update.success")
	async updatePolicy(
		@Param("policyId", ParseUUIDPipe) policyId: string,
		@Body() dto: UpdatePolicyDto,
	) {
		return this.policyFacade.updatePolicy(policyId, dto);
	}

	@Delete(":policyId")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "deletePolicy",
		summary: "Policy 삭제",
		description: "기존 Policy를 삭제합니다. (소프트 삭제)",
	})
	@ApiAuth()
	@ApiParam({
		name: "policyId",
		description: "Policy ID (UUID)",
		type: String,
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(PolicyResponseDto, HttpStatus.OK)
	@ResponseMessage("common.policy.delete.success")
	async deletePolicy(@Param("policyId", ParseUUIDPipe) policyId: string) {
		return this.policyFacade.deletePolicy(policyId);
	}

	@Put(":policyId/abilities")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "syncPolicyAbilities",
		summary: "Policy Ability 동기화",
		description:
			"특정 Policy에 포함되는 Ability 목록을 전체 동기화 방식으로 반영합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "policyId",
		description: "Policy ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: SyncPolicyAbilitiesDto,
		description: "Policy에 연결할 Ability 목록",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(PolicyAbilityResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("common.policy.abilities.sync.success")
	async syncPolicyAbilities(
		@Param("policyId", ParseUUIDPipe) policyId: string,
		@Body() dto: SyncPolicyAbilitiesDto,
	) {
		return this.policyFacade.syncPolicyAbilities(policyId, dto.abilityIds);
	}
}
