import { wrapResponse } from "@cocrepo/be-common";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import { OidcSessionDto, PageMetaDto, QueryOidcSessionDto } from "@cocrepo/dto";
import { OidcSessionsService } from "@cocrepo/service";
import {
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

@ApiTags("OIDC_SESSIONS")
@Controller()
export class OidcSessionsController {
	constructor(private readonly oidcSessionsService: OidcSessionsService) {}

	@Get()
	@ApiOperation({
		operationId: "getOidcSessions",
		summary: "OIDC 세션/토큰 목록 조회",
		description:
			"저장된 OIDC 세션 및 토큰 목록을 조회합니다. 모델 타입으로 필터링할 수 있습니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(OidcSessionDto, HttpStatus.OK, {
		isArray: true,
		metaDto: PageMetaDto,
	})
	@ResponseMessage("OIDC 세션 목록 조회 성공")
	async getOidcSessions(@Query() query: QueryOidcSessionDto) {
		const { data, totalCount } =
			await this.oidcSessionsService.getMany(query);

		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return wrapResponse(
			data.map((session) => plainToInstance(OidcSessionDto, session)),
			{
				meta: new PageMetaDto(skip, take, totalCount),
			},
		);
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
		await this.oidcSessionsService.revokeByKey(key);
	}

	@Post("revoke-by-grant/:grantId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "revokeOidcSessionsByGrant",
		summary: "Grant 일괄 폐기",
		description:
			"특정 Grant에 연결된 모든 세션 및 토큰을 일괄 폐기합니다.",
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
		await this.oidcSessionsService.revokeByGrantId(grantId);
	}
}
