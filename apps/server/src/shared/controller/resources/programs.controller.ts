import { ApiResponseEntity } from "@cocrepo/decorator";
import {
	type CreateProgramDto,
	PageMetaDto,
	ProgramDto,
	type QueryProgramDto,
	type UpdateProgramDto,
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
import { ProgramsService } from "../../service/resources/programs.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("PROGRAM")
@Controller()
export class ProgramsController {
	constructor(private readonly service: ProgramsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async createProgram(@Body() createProgramDto: CreateProgramDto) {
		const program = await this.service.create(createProgramDto);

		return program;
	}

	@Get(":programId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async getProgramById(@Param("programId") programId: string) {
		const program = await this.service.getById(programId);
		return program;
	}

	@Patch(":programId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async updateProgramById(
		@Param("programId") programId: string,
		@Body() updateProgramDto: UpdateProgramDto,
	) {
		const program = await this.service.updateById(programId, updateProgramDto);
		return program;
	}

	@Patch(":programId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async removeProgramById(@Param("programId") programId: string) {
		const program = await this.service.removeById(programId);
		return program;
	}

	@Delete(":programId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK)
	async deleteProgramById(@Param("programId") programId: string) {
		const program = await this.service.deleteById(programId);
		return program;
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(ProgramDto, HttpStatus.OK, { isArray: true })
	async getProgramsByQuery(@Query() query: QueryProgramDto) {
		const { count, items } = await this.service.getManyByQuery(query);
		return wrapResponse(items, {
			message: "success",
			meta: new PageMetaDto(query.skip, query.take, count),
		});
	}
}
