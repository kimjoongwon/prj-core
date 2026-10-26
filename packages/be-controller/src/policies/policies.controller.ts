import { RolesGuard } from "@cocrepo/be-common";
import { ListPoliciesQuery } from "@cocrepo/command";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import { PolicyResponseDto } from "@cocrepo/dto";
import { Controller, Get, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("POLICIES")
@Controller()
@UseGuards(RolesGuard)
export class PoliciesController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@Roles([SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "getPolicies",
		summary: "Policy 목록 조회",
		description: "Role 권한 할당에 사용할 Policy 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(PolicyResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("정책 목록 조회 성공")
	async getPolicies() {
		return this.queryBus.execute(new ListPoliciesQuery());
	}
}
