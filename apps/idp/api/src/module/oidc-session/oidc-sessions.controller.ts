import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
	SkipSpaceCheck,
} from "@cocrepo/decorator";
import {
	OidcSessionDto,
	OidcSessionStatsDto,
	PageMetaDto,
	QueryOidcSessionDto,
} from "@cocrepo/dto";
import { OidcSessionFacade } from "@cocrepo/facade";
import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("OIDC_SESSIONS")
@Controller()
@Roles([SYSTEM_ROLES.FULL_ACCESS])
@SkipSpaceCheck()
export class OidcSessionsController {
	constructor(
		private readonly oidcSessionFacade: OidcSessionFacade,
	) {}

	@Get()
	@ApiOperation({
		operationId: "getOidcSessions",
		summary: "OIDC 세션/토큰 목록 조회",
		description:
			"Redis에 저장된 OIDC 세션 및 토큰 목록을 조회합니다. 모델 타입 및 계정 ID로 필터링할 수 있습니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(OidcSessionDto, HttpStatus.OK, {
		isArray: true,
		metaDto: PageMetaDto,
	})
	@ResponseMessage("OIDC 세션 목록 조회 성공")
	async getOidcSessions(@Query() query: QueryOidcSessionDto) {
		return this.oidcSessionFacade.getMany(query);
	}

	@Get("stats")
	@ApiOperation({
		operationId: "getOidcSessionStats",
		summary: "OIDC 세션/토큰 통계 조회",
		description: "모델 타입별 세션/토큰 건수와 전체 건수를 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(OidcSessionStatsDto, HttpStatus.OK)
	@ResponseMessage("OIDC 세션 통계 조회 성공")
	async getOidcSessionStats() {
		return this.oidcSessionFacade.getStats();
	}

	@Post(":key/revoke")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "revokeOidcSession",
		summary: "단건 세션/토큰 폐기",
		description: "특정 세션 또는 토큰을 폐기합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "key",
		description: "세션/토큰 키 (jti 또는 uid)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ResponseMessage("세션/토큰 폐기 성공")
	async revokeOidcSession(@Param("key") key: string): Promise<void> {
		await this.oidcSessionFacade.revokeByKey(key);
	}

	@Post("revoke-all")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "revokeAllOidcSessions",
		summary: "전체 세션/토큰 일괄 폐기",
		description: "Redis에 저장된 모든 OIDC 세션 및 토큰을 일괄 폐기합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ResponseMessage("전체 세션/토큰 일괄 폐기 성공")
	async revokeAllOidcSessions(): Promise<void> {
		await this.oidcSessionFacade.revokeAll();
	}

	@Post("revoke-by-grant/:grantId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "revokeOidcSessionsByGrant",
		summary: "Grant 일괄 폐기",
		description: "특정 Grant에 연결된 모든 세션 및 토큰을 일괄 폐기합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "grantId",
		description: "Grant ID",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ResponseMessage("Grant 일괄 폐기 성공")
	async revokeOidcSessionsByGrant(
		@Param("grantId") grantId: string,
	): Promise<void> {
		await this.oidcSessionFacade.revokeByGrantId(grantId);
	}
}
