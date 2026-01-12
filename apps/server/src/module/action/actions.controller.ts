import {
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { ActionDto } from "@cocrepo/dto";
import { ActionsService } from "@cocrepo/service";
import { Controller, Get, HttpStatus, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

@ApiTags("ACTIONS")
@Controller("actions")
export class ActionsController {
	constructor(private readonly actionsService: ActionsService) {}

	@Public()
	@Get()
	@ApiOperation({
		summary: "Action 목록 조회",
		description: "모든 Action 목록을 조회합니다.",
	})
	@ApiQuery({
		name: "group",
		required: false,
		description: "그룹별 필터링 (crud, visibility, workflow)",
	})
	@ApiErrors(500)
	@ApiResponseEntity(ActionDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Action 목록 조회 성공")
	async getAll(@Query("group") group?: string) {
		const actions = group
			? await this.actionsService.getByGroup(group)
			: await this.actionsService.getAll();
		return actions.map((action) => plainToInstance(ActionDto, action));
	}

	@Public()
	@Get(":id")
	@ApiOperation({
		summary: "Action 상세 조회",
		description: "ID로 Action을 조회합니다.",
	})
	@ApiErrors(404, 500)
	@ApiResponseEntity(ActionDto, HttpStatus.OK)
	@ResponseMessage("Action 조회 성공")
	async getById(@Param("id") id: string) {
		const action = await this.actionsService.getById(id);
		return plainToInstance(ActionDto, action);
	}
}
