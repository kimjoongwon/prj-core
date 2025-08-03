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
	type CreateSubjectDto,
	PageMetaDto,
	type QuerySubjectDto,
	ResponseEntity,
	SubjectDto,
	type UpdateSubjectDto,
} from "@shared/schema";
import { plainToInstance } from "class-transformer";
import { ApiResponseEntity, Auth } from "../decorator";
import { SubjectsService } from "../service/subjects.service";

@ApiTags("SUBJECTS")
@Controller()
export class SubjectsController {
	constructor(private readonly service: SubjectsService) {}

	@Post()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
		const subject = await this.service.create(createSubjectDto);

		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SubjectDto, subject),
		);
	}

	@Get(":subjectId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async getSubject(@Param("subjectId") subjectId: string) {
		const subject = await this.service.getUnique({
			where: { id: subjectId },
		});
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SubjectDto, subject),
		);
	}

	@Patch("removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async removeSubjects(@Body() subjectIds: string[]) {
		const subjects = await this.service.updateMany({
			where: { id: { in: subjectIds } },
			data: { removedAt: new Date() },
		});
		return new ResponseEntity(HttpStatus.OK, "성공", subjects.count);
	}

	@Patch(":subjectId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async updateSubject(
		@Param("subjectId") subjectId: string,
		@Body() updateSubjectDto: UpdateSubjectDto,
	) {
		const subject = await this.service.update({
			where: { id: subjectId },
			data: updateSubjectDto,
		});
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SubjectDto, subject),
		);
	}

	@Patch(":subjectId/removedAt")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async removeSubject(@Param("subjectId") subjectId: string) {
		const subject = await this.service.remove(subjectId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SubjectDto, subject),
		);
	}

	@Delete(":subjectId")
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK)
	async deleteSubject(@Param("subjectId") subjectId: string) {
		const subject = await this.service.deleteById(subjectId);
		return new ResponseEntity(
			HttpStatus.OK,
			"성공",
			plainToInstance(SubjectDto, subject),
		);
	}

	@Get()
	@Auth()
	@HttpCode(HttpStatus.OK)
	@ApiResponseEntity(SubjectDto, HttpStatus.OK, { isArray: true })
	async getSubjectsByQuery(@Query() query: QuerySubjectDto) {
		const { count, subjects } = await this.service.getManyByQuery(query);

		return new ResponseEntity(
			HttpStatus.OK,
			"success",
			subjects.map((subject) => subject?.toDto?.() ?? subject),
			new PageMetaDto(query.skip, query.take, count),
		);
	}
}
