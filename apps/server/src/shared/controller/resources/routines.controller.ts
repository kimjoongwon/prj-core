import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	type CreateRoutineDto,
	PageMetaDto,
	type QueryRoutineDto,
	RoutineDto,
	type UpdateRoutineDto,
} from "@cocrepo/dto";
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
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RoutinesService } from "../../service/resources/routines.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("ROUTINE")
@Controller()
export class RoutinesController {
	constructor(private readonly service: RoutinesService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async createRoutine(@Body() createRoutineDto: CreateRoutineDto) {
		const routine = await this.service.create(createRoutineDto);
		return routine;
	}

	@Get(":routineId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async getRoutine(@Param("routineId") routineId: string) {
		const routine = await this.service.getById(routineId);
		return routine;
	}

	@Patch(":routineId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async updateRoutine(
		@Param("routineId") routineId: string,
		@Body() updateRoutineDto: UpdateRoutineDto,
	) {
		const routine = await this.service.updateById(routineId, updateRoutineDto);
		return routine;
	}

	@Patch(":routineId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async removeRoutine(@Param("routineId") routineId: string) {
		const routine = await this.service.removeById(routineId);
		return routine;
	}

	@Delete(":routineId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async deleteRoutine(@Param("routineId") routineId: string) {
		const routine = await this.service.deleteById(routineId);
		return routine;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK, { isArray: true })
	async getRoutinesByQuery(@Query() query: QueryRoutineDto) {
		const { count, items } = await this.service.getManyByQuery(query);
		return wrapResponse(items, {
			message: "success",
			meta: new PageMetaDto(query.skip, query.take, count),
		});
	}
}
