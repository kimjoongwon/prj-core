import { ParseUlidPipe, RoleCategoryGuard } from "@cocrepo/be-common";
import {
	CreateActionCommand,
	DeleteActionCommand,
	GetActionByIdQuery,
	GetActionsQuery,
	UpdateActionCommand,
} from "@cocrepo/command";
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
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
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
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
	) {}

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
	@ResponseMessage("액션 목록 조회 성공")
	async getActions(@Query("group") group?: string) {
		return this.queryBus.execute(new GetActionsQuery(group));
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
		description: "Action ID (ULID)",
		type: String,
	})
	@ApiErrors(404, 500)
	@ApiResponseEntity(ActionDto, HttpStatus.OK)
	@ResponseMessage("액션 조회 성공")
	async getActionById(@Param("id", ParseUlidPipe) id: string) {
		return this.queryBus.execute(new GetActionByIdQuery(id));
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
	@ResponseMessage("액션 생성 성공")
	async createAction(@Body() dto: CreateActionDto) {
		return this.commandBus.execute(new CreateActionCommand(dto));
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
		description: "Action ID (ULID)",
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
	@ResponseMessage("액션 수정 성공")
	async updateAction(
		@Param("id", ParseUlidPipe) id: string,
		@Body() dto: UpdateActionDto,
	) {
		return this.commandBus.execute(new UpdateActionCommand(id, dto));
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
		description: "Action ID (ULID)",
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
	@ResponseMessage("액션 삭제 성공")
	async deleteAction(@Param("id", ParseUlidPipe) id: string) {
		return this.commandBus.execute(new DeleteActionCommand(id));
	}
}
