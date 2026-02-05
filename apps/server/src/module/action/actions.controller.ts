import { RoleCategoryGuard } from "@cocrepo/be-common";
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
import { RoleCategoryNames } from "@cocrepo/enum";
import { ActionsService } from "@cocrepo/service";
import {
	BadRequestException,
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

/**
 * Actions 에러 메시지 상수
 */
const ActionsErrorMessages = {
	SYSTEM_ACTION_MODIFY_NOT_ALLOWED: "시스템 Action은 수정할 수 없습니다",
	SYSTEM_ACTION_DELETE_NOT_ALLOWED: "시스템 Action은 삭제할 수 없습니다",
} as const;

@ApiTags("ACTIONS")
@Controller()
export class ActionsController {
	constructor(private readonly actionsService: ActionsService) {}

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
		return group
			? await this.actionsService.getActionsByGroup(group)
			: await this.actionsService.getAllActions();
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
		return await this.actionsService.getActionById(id);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryNames.ADMIN])
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
		return await this.actionsService.createAction({
			name: dto.name,
			displayName: dto.displayName,
			description: dto.description,
			group: dto.group,
			order: dto.order,
			isSystem: dto.isSystem,
			config: dto.config,
		});
	}

	@Patch(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryNames.ADMIN])
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
		{ status: 404, message: "Action을 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(ActionDto, HttpStatus.OK)
	@ResponseMessage("common.action.update.success")
	async updateAction(
		@Param("id", ParseUUIDPipe) id: string,
		@Body() dto: UpdateActionDto,
	) {
		// 시스템 Action 수정 불가 체크
		const existingAction = await this.actionsService.getActionById(id);
		if (existingAction.isSystem) {
			throw new BadRequestException(
				ActionsErrorMessages.SYSTEM_ACTION_MODIFY_NOT_ALLOWED,
			);
		}

		const updateData = {
			...(dto.name !== undefined && { name: dto.name }),
			...(dto.displayName !== undefined && { displayName: dto.displayName }),
			...(dto.description !== undefined && { description: dto.description }),
			...(dto.group !== undefined && { group: dto.group }),
			...(dto.order !== undefined && { order: dto.order }),
			...(dto.isSystem !== undefined && { isSystem: dto.isSystem }),
			...(dto.config !== undefined && { config: dto.config }),
		};

		return await this.actionsService.updateAction(id, updateData);
	}

	@Delete(":id")
	@HttpCode(HttpStatus.OK)
	@UseGuards(RoleCategoryGuard)
	@RoleCategories([RoleCategoryNames.ADMIN])
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
		{ status: 404, message: "Action을 찾을 수 없습니다" },
		500,
	)
	@ApiResponseEntity(ActionDto, HttpStatus.OK)
	@ResponseMessage("common.action.delete.success")
	async deleteAction(@Param("id", ParseUUIDPipe) id: string) {
		// 시스템 Action 삭제 불가 체크
		const existingAction = await this.actionsService.getActionById(id);
		if (existingAction.isSystem) {
			throw new BadRequestException(
				ActionsErrorMessages.SYSTEM_ACTION_DELETE_NOT_ALLOWED,
			);
		}

		return await this.actionsService.deleteAction(id);
	}
}
