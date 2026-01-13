import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import { SubjectFieldResponseDto, SubjectResponseDto } from "@cocrepo/dto";
import { SubjectsService } from "@cocrepo/service";
import { Controller, Get, HttpStatus, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";

@ApiTags("SUBJECTS")
@Controller()
export class SubjectsController {
	constructor(private readonly subjectsService: SubjectsService) {}

	@Get()
	@ApiOperation({
		operationId: "getPrismaSubjects",
		summary: "모든 Subject 조회",
		description:
			"Prisma 스키마의 모든 모델을 Subject로 반환합니다. CASL 권한 설정에 사용됩니다.",
	})
	@ApiAuth()
	@ApiErrors(401, 500)
	@ApiResponseEntity(SubjectResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("모든 Subject 조회 성공")
	async getSubjects(): Promise<SubjectResponseDto[]> {
		const subjects = await this.subjectsService.getSubjects();

		return subjects.map((subject) =>
			plainToInstance(
				SubjectResponseDto,
				{
					name: subject.name,
					displayName: subject.displayName,
					fieldCount: subject.fields.length,
				},
				{
					excludeExtraneousValues: true,
				},
			),
		);
	}

	@Get(":name/fields")
	@ApiOperation({
		operationId: "getPrismaSubjectFields",
		summary: "Subject 필드 목록 조회",
		description:
			"특정 Subject(Prisma 모델)의 필드 목록을 반환합니다. 필드 레벨 권한 설정에 사용됩니다.",
	})
	@ApiAuth()
	@ApiParam({
		name: "name",
		description: "Subject 이름 (Prisma 모델명)",
		example: "User",
	})
	@ApiErrors(401, 500)
	@ApiResponseEntity(SubjectFieldResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Subject 필드 목록 조회 성공")
	async getSubjectFields(
		@Param("name") name: string,
	): Promise<SubjectFieldResponseDto[]> {
		const fields = await this.subjectsService.getSubjectFields(name);

		return fields.map((field) =>
			plainToInstance(SubjectFieldResponseDto, field, {
				excludeExtraneousValues: true,
			}),
		);
	}
}
