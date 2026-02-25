import { wrapResponse } from "@cocrepo/be-common";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
	SkipSpaceCheck,
} from "@cocrepo/decorator";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	CreateOidcClientDto,
	OidcClientDto,
	PageMetaDto,
	QueryOidcClientDto,
	UpdateOidcClientDto,
} from "@cocrepo/dto";
import { OidcClientsService } from "@cocrepo/service";
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
	Query,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("OIDC_CLIENTS")
@Controller()
@Roles([SYSTEM_ROLES.FULL_ACCESS])
@SkipSpaceCheck()
export class OidcClientsController {
	constructor(private readonly oidcClientsService: OidcClientsService) {}

	@Get()
	@ApiOperation({
		operationId: "getOidcClients",
		summary: "OIDC 클라이언트 목록 조회",
		description:
			"등록된 OIDC 클라이언트 목록을 조회합니다. 검색 및 필터링을 지원합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(OidcClientDto, HttpStatus.OK, {
		isArray: true,
		metaDto: PageMetaDto,
	})
	@ResponseMessage("OIDC 클라이언트 목록 조회 성공")
	async getOidcClients(@Query() query: QueryOidcClientDto) {
		const { data, totalCount } = await this.oidcClientsService.getMany(query);

		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return wrapResponse(data, {
			meta: new PageMetaDto(skip, take, totalCount),
		});
	}

	@Get(":oidcClientId")
	@ApiOperation({
		operationId: "getOidcClient",
		summary: "OIDC 클라이언트 상세 조회",
		description: "특정 OIDC 클라이언트의 상세 정보를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "oidcClientId",
		description: "OIDC 클라이언트 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(OidcClientDto, HttpStatus.OK)
	@ResponseMessage("OIDC 클라이언트 상세 조회 성공")
	async getOidcClient(
		@Param("oidcClientId", ParseUUIDPipe) oidcClientId: string,
	) {
		return this.oidcClientsService.getById(oidcClientId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createOidcClient",
		summary: "OIDC 클라이언트 등록",
		description:
			"새로운 OIDC 클라이언트를 등록합니다. Client ID는 고유해야 합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateOidcClientDto,
		description: "OIDC 클라이언트 등록 정보",
	})
	@ApiErrors(400, 401, 409, 500)
	@ApiResponseEntity(OidcClientDto, HttpStatus.CREATED)
	@ResponseMessage("OIDC 클라이언트 등록 성공")
	async createOidcClient(@Body() dto: CreateOidcClientDto) {
		return this.oidcClientsService.create({
			clientId: dto.clientId,
			clientSecret: dto.clientSecret,
			clientName: dto.clientName,
			redirectUris: dto.redirectUris,
			grantTypes: dto.grantTypes,
			responseTypes: dto.responseTypes,
			tokenEndpointAuthMethod: dto.tokenEndpointAuthMethod,
			scope: dto.scope,
			logoUri: dto.logoUri,
			policyUri: dto.policyUri,
			tosUri: dto.tosUri,
		});
	}

	@Patch(":oidcClientId")
	@ApiOperation({
		operationId: "updateOidcClient",
		summary: "OIDC 클라이언트 수정",
		description: "OIDC 클라이언트 정보를 수정합니다. Client ID는 수정할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "oidcClientId",
		description: "OIDC 클라이언트 ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateOidcClientDto,
		description: "OIDC 클라이언트 수정 정보",
	})
	@ApiErrors(400, 401, 404, 500)
	@ApiResponseEntity(OidcClientDto, HttpStatus.OK)
	@ResponseMessage("OIDC 클라이언트 수정 성공")
	async updateOidcClient(
		@Param("oidcClientId", ParseUUIDPipe) oidcClientId: string,
		@Body() dto: UpdateOidcClientDto,
	) {
		return this.oidcClientsService.update(oidcClientId, dto);
	}

	@Delete(":oidcClientId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteOidcClient",
		summary: "OIDC 클라이언트 삭제",
		description: "OIDC 클라이언트를 삭제합니다 (소프트 삭제).",
	})
	@ApiAuth()
	@ApiParam({
		name: "oidcClientId",
		description: "OIDC 클라이언트 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ResponseMessage("OIDC 클라이언트 삭제 성공")
	async deleteOidcClient(
		@Param("oidcClientId", ParseUUIDPipe) oidcClientId: string,
	): Promise<void> {
		await this.oidcClientsService.remove(oidcClientId);
	}

	@Patch(":oidcClientId/toggle-active")
	@ApiOperation({
		operationId: "toggleActiveOidcClient",
		summary: "OIDC 클라이언트 활성/비활성 토글",
		description: "OIDC 클라이언트의 활성 상태를 반전시킵니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "oidcClientId",
		description: "OIDC 클라이언트 ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(OidcClientDto, HttpStatus.OK)
	@ResponseMessage("OIDC 클라이언트 상태 변경 성공")
	async toggleActiveOidcClient(
		@Param("oidcClientId", ParseUUIDPipe) oidcClientId: string,
	) {
		return this.oidcClientsService.toggleActive(oidcClientId);
	}
}
