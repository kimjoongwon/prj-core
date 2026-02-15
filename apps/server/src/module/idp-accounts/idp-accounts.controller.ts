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
	IdpAccountDto,
	PageMetaDto,
	QueryIdpAccountDto,
} from "@cocrepo/dto";
import { IdpAccountService } from "@cocrepo/service";
import {
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
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

@ApiTags("IDP_ACCOUNTS")
@Controller()
@Roles([SYSTEM_ROLES.FULL_ACCESS])
@SkipSpaceCheck()
export class IdpAccountsController {
	constructor(private readonly accountService: IdpAccountService) {}

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
		const { data, totalCount } = await this.accountService.getMany(query);
		const skip = query.skip ?? 0;
		const take = query.take ?? 20;

		return wrapResponse(
			data.map((account) => plainToInstance(IdpAccountDto, account)),
			{ meta: new PageMetaDto(skip, take, totalCount) },
		);
	}

	@Get(":userId")
	@ApiOperation({
		operationId: "getIdpAccount",
		summary: "IDP 계정 상세 조회",
		description: "계정의 보안 정보와 최근 감사 로그를 함께 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({ name: "userId", description: "사용자 ID (UUID)", type: String })
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(IdpAccountDto, HttpStatus.OK)
	@ResponseMessage("계정 상세 조회 성공")
	async getAccount(@Param("userId", ParseUUIDPipe) userId: string) {
		const account = await this.accountService.getById(userId);
		return plainToInstance(IdpAccountDto, account);
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
		const account = await this.accountService.toggleActive(userId);
		return plainToInstance(IdpAccountDto, account);
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
		await this.accountService.resetFailedAttempts(userId);
	}
}
