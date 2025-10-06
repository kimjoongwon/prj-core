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
	type CreateSubjectDto,
	PageMetaDto,
	type QuerySubjectDto,
	SubjectDto,
	type UpdateSubjectDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { SubjectsService } from "../../service/resources/subjects.service";
import { wrapResponse } from "../../util/response.util";

@ApiTags("SUBJECTS")
@Controller()
export class SubjectsController {
	constructor(private readonly service: SubjectsService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
		const subject = await this.service.create(createSubjectDto);

		return plainToInstance(SubjectDto, subject);
	}

	@Get(":subjectId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async getSubject(@Param("subjectId") subjectId: string) {
		const subject = await this.service.getById(subjectId);
		return plainToInstance(SubjectDto, subject);
	}

	@Patch("removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async removeSubjects(@Body() subjectIds: string[]) {
		// Note: updateMany is discontinued, this endpoint may need to be updated to handle individual calls
		const promises = subjectIds.map((id) => this.service.removeById(id));
		const results = await Promise.all(promises);
		const subjects = { count: results.length };
		return subjects.count;
	}

	@Patch(":subjectId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async updateSubject(
		@Param("subjectId") subjectId: string,
		@Body() updateSubjectDto: UpdateSubjectDto,
	) {
		const subject = await this.service.updateById(subjectId, updateSubjectDto);
		return plainToInstance(SubjectDto, subject);
	}

	@Patch(":subjectId/removedAt")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async removeSubject(@Param("subjectId") subjectId: string) {
		const subject = await this.service.removeById(subjectId);
		return plainToInstance(SubjectDto, subject);
	}

	@Delete(":subjectId")
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async deleteSubject(@Param("subjectId") subjectId: string) {
		const subject = await this.service.deleteById(subjectId);
		return plainToInstance(SubjectDto, subject);
	}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK, { isArray: true })
	async getSubjectsByQuery(@Query() query: QuerySubjectDto) {
		const { count, subjects } = await this.service.getManyByQuery(query);

		return wrapResponse(
			subjects.map((subject) => subject?.toDto?.() ?? subject),
			{
				message: "success",
				meta: new PageMetaDto(query.skip, query.take, count),
			},
		);
	}
}
