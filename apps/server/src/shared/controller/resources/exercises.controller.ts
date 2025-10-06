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
	ApiResponseEntity,
	CreateExerciseDto,
	ExerciseDto,
	PageMetaDto,
	QueryExerciseDto,
	UpdateExerciseDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ExercisesService } from "../../service/resources/exercises.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("EXERCISES")
@Controller()
export class ExercisesController {
	constructor(private readonly service: ExercisesService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK, { isArray: true })
	async getExercisesByQuery(@Query() query: QueryExerciseDto) {
		const { count, exercises } = await this.service.getManyByQuery(query);
		return wrapResponse(
			exercises.map((exercise) => exercise?.toDto?.() ?? exercise),
			{
				message: "success",
				meta: new PageMetaDto(query.skip, query.take, count),
			},
		);
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
	async createExercise(@Body() createExerciseDto: CreateExerciseDto) {
		const exercise = await this.service.create(createExerciseDto);
		return exercise?.toDto?.() ?? exercise;
	}

	@Get(":exerciseId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
	async getExercise(@Param("exerciseId") exerciseId: string) {
		const exercise = await this.service.getById(exerciseId);
		return exercise?.toDto?.() ?? exercise;
	}

	@Patch(":exerciseId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
	async updateExercise(
		@Param("exerciseId") exerciseId: string,
		@Body() updateExerciseDto: UpdateExerciseDto,
	) {
		const exercise = await this.service.updateById(
			exerciseId,
			updateExerciseDto,
		);
		return plainToInstance(ExerciseDto, exercise);
	}

	@Patch(":exerciseId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
	async removeExercise(@Param("exerciseId") exerciseId: string) {
		const exercise = await this.service.removeById(exerciseId);
		return plainToInstance(ExerciseDto, exercise);
	}

	@Delete(":exerciseId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ExerciseDto, HttpStatus.OK)
	async deleteExercise(@Param("exerciseId") exerciseId: string) {
		const exercise = await this.service.deleteById(exerciseId);
		return plainToInstance(ExerciseDto, exercise);
	}
}
