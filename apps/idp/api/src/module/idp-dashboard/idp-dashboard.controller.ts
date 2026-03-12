import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
	SkipSpaceCheck,
} from "@cocrepo/decorator";
import { DashboardStatsDto, LoginTrendItemDto } from "@cocrepo/dto";
import { IdpDashboardApplicationService } from "@cocrepo/app";
import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("IDP_DASHBOARD")
@Controller()
	@Roles([SYSTEM_ROLES.FULL_ACCESS])
	@SkipSpaceCheck()
export class IdpDashboardController {
	constructor(
		private readonly idpDashboardService: IdpDashboardApplicationService,
	) {}

	@Get("stats")
	@ApiOperation({
		operationId: "getIdpDashboardStats",
		summary: "IDP 대시보드 통계 조회",
		description:
			"활성 세션, 로그인 성공/실패/잠금 현황, 잠금 계정 수 등 종합 통계를 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(DashboardStatsDto, HttpStatus.OK)
	@ResponseMessage("대시보드 통계 조회 성공")
	async getStats() {
		return this.idpDashboardService.getStats();
	}

	@Get("login-trend")
	@ApiOperation({
		operationId: "getIdpLoginTrend",
		summary: "로그인 추이 조회",
		description: "최근 7일간 일별 로그인 성공/실패 건수를 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(LoginTrendItemDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("로그인 추이 조회 성공")
	async getLoginTrend() {
		return this.idpDashboardService.getLoginTrend();
	}
}
