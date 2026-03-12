import { TasksApplicationService } from "@cocrepo/app";
import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES, USER_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	CreateExerciseDto,
	ExerciseDto,
	GetExercisesQueryDto,
	RoutineDto,
	SpaceScope,
	TaskDto,
	UpdateExerciseDto,
} from "@cocrepo/dto";
import { Routine, Task } from "@cocrepo/entity";
import { AuthContext, SpaceContext } from "@cocrepo/service";
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
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("TASKS")
@Controller()
export class TasksController {
	constructor(
		private readonly tasksService: TasksApplicationService,
		private readonly authContext: AuthContext,
		private readonly spaceContext: SpaceContext,
	) {}

	@Get()
	@ApiOperation({
		operationId: "getTasks",
		summary: "Task 목록 조회",
		description: "Exercise detail이 있는 Task 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(TaskDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Task 목록 조회 성공")
	async getTasks(@Query() query: GetExercisesQueryDto) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}
		const spaceScope = query.spaceScope ?? SpaceScope.CURRENT;

		return this.tasksService.findTasks({
			spaceId,
			spaceScope,
			skip: query.skip,
			take: query.take,
			search: query.search,
		});
	}

	@Get(":taskId")
	@ApiOperation({
		operationId: "getTaskById",
		summary: "Task 상세 조회",
		description: "Exercise detail을 포함한 Task를 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "taskId",
		description: "Task ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(TaskDto, HttpStatus.OK)
	@ResponseMessage("Task 상세 조회 성공")
	async getTaskById(
		@Param("taskId", ParseUUIDPipe) taskId: string,
	): Promise<Task> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.tasksService.findTaskById(taskId, spaceId);
	}

	@Get(":taskId/exercise")
	@ApiOperation({
		operationId: "getTaskExercise",
		summary: "Task의 Exercise detail 조회",
		description: "Task에 종속된 1:1 Exercise detail을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "taskId",
		description: "Task ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
	@ResponseMessage("Task Exercise 조회 성공")
	async getTaskExercise(@Param("taskId", ParseUUIDPipe) taskId: string) {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.tasksService.getExerciseByTaskId(taskId, spaceId);
	}

	@Get(":taskId/routines")
	@ApiOperation({
		operationId: "getTaskRoutines",
		summary: "Task 연관 루틴 조회",
		description: "특정 Task의 Exercise를 사용하는 루틴 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "taskId",
		description: "Task ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Task 연관 루틴 조회 성공")
	async getTaskRoutines(
		@Param("taskId", ParseUUIDPipe) taskId: string,
	): Promise<Routine[]> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.tasksService.findTaskRoutines(taskId, spaceId);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "createTask",
		summary: "Task 생성",
		description: "Task root와 Exercise detail을 함께 생성합니다.",
	})
	@ApiAuth()
	@ApiBody({
		type: CreateExerciseDto,
		description: "Task 생성에 필요한 Exercise detail 정보",
	})
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(TaskDto, HttpStatus.CREATED)
	@ResponseMessage("Task 생성 성공")
	async createTask(@Body() dto: CreateExerciseDto): Promise<Task> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const userId = this.authContext.user?.id;
		if (!userId) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		return this.tasksService.createTaskWithExercise(dto, spaceId, userId);
	}

	@Patch(":taskId/exercise")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "updateTaskExercise",
		summary: "Task의 Exercise detail 수정",
		description: "Task root 아래의 Exercise detail을 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "taskId",
		description: "Task ID (UUID)",
		type: String,
	})
	@ApiBody({
		type: UpdateExerciseDto,
		description: "수정할 Exercise detail 정보",
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(TaskDto, HttpStatus.OK)
	@ResponseMessage("Task Exercise 수정 성공")
	async updateTaskExercise(
		@Param("taskId", ParseUUIDPipe) taskId: string,
		@Body() dto: UpdateExerciseDto,
	): Promise<Task> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.tasksService.updateTaskExercise(
			taskId,
			dto,
			spaceId,
		);
	}

	@Delete(":taskId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.MANAGE, SYSTEM_ROLES.FULL_ACCESS])
	@ApiOperation({
		operationId: "deleteTask",
		summary: "Task 삭제",
		description: "Task root와 Exercise detail을 함께 소프트 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "taskId",
		description: "Task ID (UUID)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ResponseMessage("Task 삭제 성공")
	async deleteTask(
		@Param("taskId", ParseUUIDPipe) taskId: string,
	): Promise<void> {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		await this.tasksService.deleteTask(taskId, spaceId);
	}
}
