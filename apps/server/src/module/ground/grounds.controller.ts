import { ApiErrors, ResponseMessage } from "@cocrepo/be-common";
import { ApiResponseEntity, Public } from "@cocrepo/decorator";
import { GroundDto } from "@cocrepo/dto";
import { GroundsService } from "@cocrepo/service";
import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

@ApiTags("GROUNDS")
@Controller("grounds")
export class GroundsController {
	constructor(private readonly groundsService: GroundsService) {}

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
		const grounds = await this.groundsService.getAll();
		return grounds.map((ground) => plainToInstance(GroundDto, ground));
	}
}
