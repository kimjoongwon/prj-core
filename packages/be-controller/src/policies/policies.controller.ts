import { RolesGuard } from "@cocrepo/be-common";
import {
	CreatePolicyCommand,
	DeletePolicyCommand,
	GetPolicyByIdQuery,
	ListPoliciesQuery,
	SyncPolicyEntriesCommand,
	UpdatePolicyCommand,
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
	CreatePolicyDto,
	PolicyEntryResponseDto,
	PolicyResponseDto,
	SyncPolicyEntriesDto,
	UpdatePolicyDto,
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
	Put,
	UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("POLICIES")
@Controller()
@UseGuards(RolesGuard)
export class PoliciesController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getPolicies",
		summary: "Policy 목록 조회",
		description: "Policy 기반 권한 정책 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(PolicyResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("정책 목록 조회 성공")
	async getPolicies() {
		return this.queryBus.execute(new ListPoliciesQuery());
	}

	@Get(":policyId")
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("정책 조회 성공")
	async getPolicyById(@Param("policyId", ParseUUIDPipe) policyId: string) {
		return this.queryBus.execute(new GetPolicyByIdQuery(policyId));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("정책 생성 성공")
	async createPolicy(@Body() dto: CreatePolicyDto) {
		return this.commandBus.execute(new CreatePolicyCommand(dto));
	}

	@Patch(":policyId")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("정책 수정 성공")
	async updatePolicy(
		@Param("policyId", ParseUUIDPipe) policyId: string,
		@Body() dto: UpdatePolicyDto,
	) {
		return this.commandBus.execute(new UpdatePolicyCommand(policyId, dto));
	}

	@Delete(":policyId")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
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
	@ResponseMessage("정책 삭제 성공")
	async deletePolicy(@Param("policyId", ParseUUIDPipe) policyId: string) {
		return this.commandBus.execute(new DeletePolicyCommand(policyId));
	}

	@Put(":policyId/entries")
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "syncPolicyEntries",
		summary: "Policy 권한 항목 동기화",
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
		type: SyncPolicyEntriesDto,
		description: "Policy에 연결할 Ability 목록",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(PolicyEntryResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("정책 권한 동기화 성공")
	async syncPolicyEntries(
		@Param("policyId", ParseUUIDPipe) policyId: string,
		@Body() dto: SyncPolicyEntriesDto,
	) {
		return this.commandBus.execute(
			new SyncPolicyEntriesCommand(policyId, dto.entries),
		);
	}
}
