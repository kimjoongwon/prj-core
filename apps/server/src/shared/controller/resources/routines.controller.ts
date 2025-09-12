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
import {
	type CreateRoutineDto,
	PageMetaDto,
	type QueryRoutineDto,
	ResponseEntity,
	RoutineDto,
	type UpdateRoutineDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity, Auth } from "../../decorator";
import { RoutinesService } from "../../service/resources/routines.service";

@ApiTags("ROUTINE")
@Controller()
export class RoutinesController {
	constructor(private readonly service: RoutinesService) {}

	@Post()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async createRoutine(@Body() createRoutineDto: CreateRoutineDto) {
		const routine = await this.service.create(createRoutineDto);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			routine?.toDto?.() ?? routine,
		);
	}

	@Get(":routineId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async getRoutine(@Param("routineId") routineId: string) {
		const routine = await this.service.getById(routineId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			routine?.toDto?.() ?? routine,
		);
	}

	@Patch(":routineId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async updateRoutine(
		@Param("routineId") routineId: string,
		@Body() updateRoutineDto: UpdateRoutineDto,
	) {
		const routine = await this.service.updateById(routineId, updateRoutineDto);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(RoutineDto, routine),
		);
	}

	@Patch(":routineId/removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async removeRoutine(@Param("routineId") routineId: string) {
		const routine = await this.service.removeById(routineId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(RoutineDto, routine),
		);
	}

	@Delete(":routineId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK)
	async deleteRoutine(@Param("routineId") routineId: string) {
		const routine = await this.service.deleteById(routineId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(RoutineDto, routine),
		);
	}

	@Get()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(RoutineDto, HttpStatus.OK, { isArray: true })
	async getRoutinesByQuery(@Query() query: QueryRoutineDto) {
		const { count, items } = await this.service.getManyByQuery(query);
		return new ResponseEntity(
			HttpStatus.OK,
			"success",
			items.map((item) => item?.toDto?.() ?? item),
			new PageMetaDto(query.skip, query.take, count),
		);
	}
}
