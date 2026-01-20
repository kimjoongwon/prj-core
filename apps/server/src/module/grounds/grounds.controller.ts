import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { GroundDto } from "@cocrepo/dto";
import { GroundsService } from "@cocrepo/service";
import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ClsService } from "nestjs-cls";

@ApiTags("GROUNDS")
@Controller("grounds")
export class GroundsController {
	constructor(
		private readonly groundsService: GroundsService,
		private readonly cls: ClsService,
	) {}

	@Public()
	@Get()
	@ApiOperation({
		operationId: "getGrounds",
		summary: "Ground 목록 조회",
		description: "모든 Ground 목록을 조회합니다.",
	})
	@ApiErrors(500)
	@ApiResponseEntity(GroundDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Ground 목록 조회 성공")
	async getGrounds() {
		return this.groundsService.getAll();
	}

	@Get("my")
	@ApiOperation({
		operationId: "getMyGrounds",
		summary: "내 Space의 Ground 목록 조회",
		description:
			"X-Space-ID 헤더로 지정한 Space의 Ground를 조회합니다. SUPER_ADMIN은 헤더 없이 모든 Ground 조회 가능.",
	})
	@ApiAuth()
	@ApiErrors(500)
	@ApiResponseEntity(GroundDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("내 Space의 Ground 목록 조회 성공")
	async getMyGrounds() {
		const spaceId = this.cls.get<string | undefined>(CONTEXT_KEYS.SPACE_ID);
		return this.groundsService.getMyGrounds(spaceId);
	}
}
