import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	GrantIdpAccountAccessDto,
	IdpAccountAccessGrantFormBootstrapDto,
	IdpAccountAccessGrantFormFieldMetaDto,
	IdpAccountAccessGrantFormOptionItemDto,
	IdpAccountAccessGrantFormSchemaDto,
	IdpAccountAccessGrantFormUiPathsDto,
	IdpAccountDetailDto,
	IdpAccountDto,
	PageMetaDto,
	QueryIdpAccountDto,
} from "@cocrepo/dto";
import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseUUIDPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import {
	ApiBody,
	ApiExtraModels,
	ApiOperation,
	ApiParam,
	ApiTags,
} from "@nestjs/swagger";
import {
	GetIdpAccountAccessGrantFormQuery,
	GetIdpAccountQuery,
	GetIdpAccountsQuery,
	GrantIdpAccountAccessCommand,
	ResetIdpAccountFailedAttemptsCommand,
	ToggleIdpAccountActiveCommand,
} from "@cocrepo/command";

@ApiTags("IDP_ACCOUNTS")
@ApiExtraModels(
	IdpAccountAccessGrantFormOptionItemDto,
	IdpAccountAccessGrantFormUiPathsDto,
	IdpAccountAccessGrantFormFieldMetaDto,
	IdpAccountAccessGrantFormSchemaDto,
)
@Controller()
export class IdpAccountsController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

	@Get()
	@ApiOperation({
		operationId: "getIdpAccounts",
		summary: "IDP 계정 목록 조회",
		description: "IDP 계정 목록을 보안 정보와 함께 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(IdpAccountDto, HttpStatus.OK, {
		isArray: true,
		metaDto: PageMetaDto,
	})
	@ResponseMessage("계정 목록 조회 성공")
	async getAccounts(@Query() query: QueryIdpAccountDto) {
		return this.queryBus.execute(new GetIdpAccountsQuery(query));
	}

	@Get(":userId")
	@ApiOperation({
		operationId: "getIdpAccount",
		summary: "IDP 계정 상세 조회",
		description: "계정의 보안 정보와 부여된 접근 권한을 함께 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "userId", description: "사용자 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(IdpAccountDetailDto, HttpStatus.OK)
	@ResponseMessage("계정 상세 조회 성공")
	async getAccount(@Param("userId", ParseUUIDPipe) userId: string) {
		return this.queryBus.execute(new GetIdpAccountQuery(userId));
	}

	@Get(":userId/access-grant-form")
	@ApiOperation({
		operationId: "getIdpAccountAccessGrantForm",
		summary: "IDP 계정 접근 권한 부여 폼 조회",
		description:
			"계정 상세에서 관리자가 Space와 Role을 선택해 접근 권한을 부여할 수 있도록 폼 초기값과 옵션을 반환합니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "userId", description: "사용자 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(IdpAccountAccessGrantFormBootstrapDto, HttpStatus.OK)
	@ResponseMessage("계정 접근 권한 부여 폼 조회 성공")
	async getAccessGrantForm(@Param("userId", ParseUUIDPipe) userId: string) {
		return this.queryBus.execute(new GetIdpAccountAccessGrantFormQuery(userId));
	}

	@Post(":userId/access-grants")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "grantIdpAccountAccess",
		summary: "IDP 계정 접근 권한 부여",
		description:
			"계정에 Space 접근 권한과 Role을 직접 부여합니다. 이미 같은 Space 권한이 있으면 Role을 갱신합니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "userId", description: "사용자 ID (UUID)", type: String })
	@ApiBody({
		type: GrantIdpAccountAccessDto,
		description: "계정 접근 권한 부여 payload",
	})
	@ApiErrors(400, 401, 404, 500)
	@ApiResponseEntity(IdpAccountDetailDto, HttpStatus.OK)
	@ResponseMessage("계정 접근 권한 부여 성공")
	async grantAccess(
		@Param("userId", ParseUUIDPipe) userId: string,
		@Body() dto: GrantIdpAccountAccessDto,
	) {
		return this.commandBus.execute(
			new GrantIdpAccountAccessCommand(userId, dto),
		);
	}

	@Patch(":userId/toggle-active")
	@ApiOperation({
		operationId: "toggleIdpAccountActive",
		summary: "계정 활성/비활성 토글",
		description: "계정의 활성 상태를 반전시킵니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "userId", description: "사용자 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(IdpAccountDto, HttpStatus.OK)
	@ResponseMessage("계정 상태 변경 성공")
	async toggleActive(@Param("userId", ParseUUIDPipe) userId: string) {
		return this.commandBus.execute(new ToggleIdpAccountActiveCommand(userId));
	}

	@Post(":userId/reset-failed-attempts")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "resetIdpAccountFailedAttempts",
		summary: "로그인 실패 횟수 초기화",
		description: "로그인 실패 횟수를 0으로 초기화하고 잠금을 해제합니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "userId", description: "사용자 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ResponseMessage("실패 횟수 초기화 성공")
	async resetFailedAttempts(
		@Param("userId", ParseUUIDPipe) userId: string,
	): Promise<void> {
		await this.commandBus.execute(
			new ResetIdpAccountFailedAttemptsCommand(userId),
		);
	}
}
