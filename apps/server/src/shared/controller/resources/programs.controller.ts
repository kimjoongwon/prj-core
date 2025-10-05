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
	type CreateProgramDto,
	PageMetaDto,
	ProgramDto,
	type QueryProgramDto,
	ResponseEntity,
	type UpdateProgramDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ProgramsService } from "../../service/resources/programs.service";

@ApiTags("PROGRAM")
@Controller()
export class ProgramsController {
	constructor(private readonly service: ProgramsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async createProgram(@Body() createProgramDto: CreateProgramDto) {
		const program = await this.service.create(createProgramDto);

		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(ProgramDto, program),
		);
	}

	@Get(":programId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async getProgramById(@Param("programId") programId: string) {
		const program = await this.service.getById(programId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			program?.toDto?.() ?? program,
		);
	}

	@Patch(":programId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async updateProgramById(
		@Param("programId") programId: string,
		@Body() updateProgramDto: UpdateProgramDto,
	) {
		const program = await this.service.updateById(programId, updateProgramDto);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(ProgramDto, program),
		);
	}

	@Patch(":programId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async removeProgramById(@Param("programId") programId: string) {
		const program = await this.service.removeById(programId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(ProgramDto, program),
		);
	}

	@Delete(":programId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async deleteProgramById(@Param("programId") programId: string) {
		const program = await this.service.deleteById(programId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(ProgramDto, program),
		);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK, { isArray: true })
	async getProgramsByQuery(@Query() query: QueryProgramDto) {
		const { count, items } = await this.service.getManyByQuery(query);
		return new ResponseEntity(
			HttpStatus.OK,
			"success",
			items.map((program) => program?.toDto?.() ?? program),
			new PageMetaDto(query.skip, query.take, count),
		);
	}
}
