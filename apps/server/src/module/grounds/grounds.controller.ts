import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { GroundDto, TenantDto } from "@cocrepo/dto";
import { GroundsService } from "@cocrepo/service";
import {
	Controller,
	ForbiddenException,
	Get,
	HttpStatus,
} from "@nestjs/common";
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
		summary: "Ground 목록 조회",
		description: "모든 Ground 목록을 조회합니다.",
	})
	@ApiErrors(500)
	@ApiResponseEntity(GroundDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Ground 목록 조회 성공")
	async getAll() {
		return this.groundsService.getAll();
	}

	@Get("my")
	@ApiOperation({
		summary: "내 Space의 Ground 목록 조회",
		description:
			"로그인한 사용자의 현재 Space에 해당하는 Ground 목록을 조회합니다. X-Space-ID 헤더가 필요합니다.",
	})
	@ApiAuth()
	@ApiErrors({ status: 403, message: "Space 접근 권한이 없습니다" }, 500)
	@ApiResponseEntity(GroundDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("내 Space의 Ground 목록 조회 성공")
	async getMyGrounds() {
		const tenant = this.cls.get<TenantDto>(CONTEXT_KEYS.TENANT);

		if (!tenant?.spaceId) {
			throw new ForbiddenException("Space 접근 권한이 없습니다");
		}

		return this.groundsService.getMyGrounds(tenant.spaceId);
	}
}
