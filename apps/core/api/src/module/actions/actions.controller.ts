import { RoleCategoryGuard } from "@cocrepo/be-common";
import { ACTION_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
	RoleCategories,
} from "@cocrepo/decorator";
import {
	ActionDto,
	ActionExcludePresets,
	CreateActionDto,
	UpdateActionDto,
} from "@cocrepo/dto";
import { RoleCategoryName } from "@cocrepo/enum";
import { ActionFacade } from "@cocrepo/facade";
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
	UseGuards,
} from "@nestjs/common";
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiQuery,
	ApiTags,
} from "@nestjs/swagger";

@ApiTags("ACTIONS")
@Controller()
export class ActionsController {
	constructor(private readonly actionsService: ActionFacade) {}

	@Public()
	@Get()
	@ApiOperation({
		operationId: "getActions",
		summary: "Action 목록 조회",
		description: "모든 Action 목록을 조회합니다.",
	})
	@ApiQuery({
		name: "group",
		required: false,
		description: "그룹별 필터링 (crud, visibility, workflow)",
	})
	@ApiErrors(500)
	@ApiResponseEntity(ActionDto, HttpStatus.OK, {
		isArray: true,
		exclude: ActionExcludePresets.LIST,
	})
	@ResponseMessage("common.action.list.success")
	async getActions(@Query("group") group?: string) {
		if (group) {
			return this.actionsService.getActionsByGroup(group);
		}

		return this.actionsService.getAllActions();
	}

	@Public()
	@Get(":id")
	@ApiOperation({
		operationId: "getActionById",
		summary: "Action 상세 조회",
		description: "ID로 Action을 조회합니다.",
	})
	@ApiParam({
		name: "id",
		description: "Action ID (UUID)",
		type: String,
	})
	@ApiErrors(404, 500)
	@ApiResponseEntity(ActionDto, HttpStatus.OK)
	@ResponseMessage("common.action.read.success")
	async getActionById(@Param("id", ParseUUIDPipe) id: string) {
		return this.actionsService.getActionById(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryName.WORKSPACE])
	@ApiOperation({
		operationId: "createAction",
		summary: "Action 생성",
		description: "새로운 Action을 생성합니다. 관리자 전용 API입니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateActionDto,
		description: "생성할 Action 정보",
	})
	@ApiErrors(400, 401, 403, 500)
	@ApiResponseEntity(ActionDto, HttpStatus.CREATED)
	@ResponseMessage("common.action.create.success")
	async createAction(@Body() dto: CreateActionDto) {
		return this.actionsService.createAction(dto);
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryName.WORKSPACE])
	@ApiOperation({
		operationId: "updateAction",
		summary: "Action 수정",
		description:
			"Action 정보를 수정합니다. 관리자 전용 API이며, 시스템 Action은 수정할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Action ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateActionDto,
		description: "수정할 Action 정보",
	})
	@ApiErrors(
		400,
		401,
		403,
		{ status: 404, message: ACTION_ERRORS.NOT_FOUND },
		500,
	)
	@ApiResponseEntity(ActionDto, HttpStatus.OK)
	@ResponseMessage("common.action.update.success")
	async updateAction(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateActionDto,
	) {
		return this.actionsService.updateAction(id, dto);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryName.WORKSPACE])
	@ApiOperation({
		operationId: "deleteAction",
		summary: "Action 삭제",
		description:
			"Action을 삭제합니다 (소프트 삭제). 관리자 전용 API이며, 시스템 Action은 삭제할 수 없습니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Action ID (UUID)",
		type: String,
	})
	@ApiErrors(
		400,
		401,
		403,
		{ status: 404, message: ACTION_ERRORS.NOT_FOUND },
		500,
	)
	@ApiResponseEntity(ActionDto, HttpStatus.OK)
	@ResponseMessage("common.action.delete.success")
	async deleteAction(@Param("id", ParseUUIDPipe) id: string) {
		return this.actionsService.deleteAction(id);
	}
}
