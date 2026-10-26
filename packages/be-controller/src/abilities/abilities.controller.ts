import { GetMyAbilitiesQuery } from "@cocrepo/command";
import { USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import { AbilityResponseDto } from "@cocrepo/dto";
import { Ability } from "@cocrepo/entity";
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("ABILITIES")
@Controller()
export class AbilitiesController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get("my")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getMyAbilities",
		summary: "현재 로그인 사용자의 권한 조회",
		description:
			"현재 선택한 Space 기준으로 로그인 사용자에게 적용되는 Role/User Policy를 병합해 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: USER_ERRORS.USER_NOT_FOUND },
		{ status: 401, message: USER_ERRORS.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(AbilityResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("내 권한 조회 성공")
	async getMyAbilities(): Promise<Ability[]> {
		return this.queryBus.execute(new GetMyAbilitiesQuery());
	}
}
