import { ParseBigIntIdPipe, RolesGuard } from "@cocrepo/be-common";
import {
	CreateTaskCommand,
	DeleteTaskCommand,
	FindTasksQuery,
	GetTaskExerciseQuery,
	GetTaskRoutinesQuery,
	UpdateTaskExerciseCommand,
} from "@cocrepo/command";
import { SYSTEM_ROLES, USER_ERRORS } from "@cocrepo/constant";
import { AuthContext, SpaceContext } from "@cocrepo/context";
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
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("TASKS")
@Controller()
export class TasksController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly queryBus: QueryBus,
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
		const spaceSeq = this.spaceContext.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const spaceScope = query.spaceScope ?? SpaceScope.CURRENT;

		return this.queryBus.execute(
			new FindTasksQuery({
				...query,
				spaceSeq,
				spaceScope,
			}),
		);
	}

	@Get(":taskSeq/exercise")
	@ApiOperation({
		operationId: "getTaskExercise",
		summary: "Task의 Exercise detail 조회",
		description: "Task에 종속된 1:1 Exercise detail을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "taskSeq",
		description: "Task ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
	@ResponseMessage("Task Exercise 조회 성공")
	async getTaskExercise(@Param("taskSeq", ParseBigIntIdPipe) taskSeq: bigint) {
		const spaceSeq = this.spaceContext.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.queryBus.execute(new GetTaskExerciseQuery(taskSeq, spaceSeq));
	}

	@Get(":taskSeq/routines")
	@ApiOperation({
		operationId: "getTaskRoutines",
		summary: "Task 연관 루틴 조회",
		description: "특정 Task의 Exercise를 사용하는 루틴 목록을 조회합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "taskSeq",
		description: "Task ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiErrors(401, 404, 500)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Task 연관 루틴 조회 성공")
	async getTaskRoutines(
		@Param("taskSeq", ParseBigIntIdPipe) taskSeq: bigint,
	): Promise<Routine[]> {
		const spaceSeq = this.spaceContext.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.queryBus.execute(new GetTaskRoutinesQuery(taskSeq, spaceSeq));
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER, SYSTEM_ROLES.PLATFORM_ADMIN])
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
		const spaceSeq = this.spaceContext.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const userSeq = this.authContext.user?.id;
		if (!userSeq) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		return this.commandBus.execute(new CreateTaskCommand(dto, spaceSeq, userSeq));
	}

	@Patch(":taskSeq/exercise")
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER, SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "updateTaskExercise",
		summary: "Task의 Exercise detail 수정",
		description: "Task root 아래의 Exercise detail을 수정합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "taskSeq",
		description: "Task ID (canonical decimal BIGINT string)",
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
		@Param("taskSeq", ParseBigIntIdPipe) taskSeq: bigint,
		@Body() dto: UpdateExerciseDto,
	): Promise<Task> {
		const spaceSeq = this.spaceContext.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		return this.commandBus.execute(
			new UpdateTaskExerciseCommand(taskSeq, dto, spaceSeq),
		);
	}

	@Delete(":taskSeq")
	@HttpCode(HttpStatus.NO_CONTENT)
	@UseGuards(RolesGuard)
	@Roles([SYSTEM_ROLES.COMPANY_MANAGER, SYSTEM_ROLES.PLATFORM_ADMIN])
	@ApiOperation({
		operationId: "deleteTask",
		summary: "Task 삭제",
		description: "Task root와 Exercise detail을 함께 소프트 삭제합니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "taskSeq",
		description: "Task ID (canonical decimal BIGINT string)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ResponseMessage("Task 삭제 성공")
	async deleteTask(
		@Param("taskSeq", ParseBigIntIdPipe) taskSeq: bigint,
	): Promise<void> {
		const spaceSeq = this.spaceContext.spaceSeq;
		if (!spaceSeq) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		await this.commandBus.execute(new DeleteTaskCommand(taskSeq, spaceSeq));
	}
}
