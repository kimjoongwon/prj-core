import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
	SkipSpaceCheck,
} from "@cocrepo/decorator";
import { SecurityPolicyDto, UpdateSecurityPolicyDto } from "@cocrepo/dto";
import { SecurityPolicyService } from "@cocrepo/service";
import { Body, Controller, Get, HttpStatus, Patch } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("SECURITY_POLICY")
@Controller()
@Roles([SYSTEM_ROLES.FULL_ACCESS])
@SkipSpaceCheck()
export class SecurityPolicyController {
	constructor(private readonly securityPolicyService: SecurityPolicyService) {}

	@Get()
	@ApiOperation({
		operationId: "getSecurityPolicy",
		summary: "보안 정책 조회",
		description: "현재 시스템 보안 정책을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(SecurityPolicyDto, HttpStatus.OK)
	@ResponseMessage("보안 정책 조회 성공")
	async getSecurityPolicy() {
		return this.securityPolicyService.getDefault();
	}

	@Patch()
	@ApiOperation({
		operationId: "updateSecurityPolicy",
		summary: "보안 정책 수정",
		description: "시스템 보안 정책을 수정합니다. 변경할 필드만 전달합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: UpdateSecurityPolicyDto,
		description: "보안 정책 수정 정보",
	})
	@ApiErrors(400, 401, 404, 500)
	@ApiResponseEntity(SecurityPolicyDto, HttpStatus.OK)
	@ResponseMessage("보안 정책 수정 성공")
	async updateSecurityPolicy(@Body() dto: UpdateSecurityPolicyDto) {
		return this.securityPolicyService.update(dto);
	}
}
