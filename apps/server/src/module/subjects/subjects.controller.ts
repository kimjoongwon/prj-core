import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import { SubjectsService } from "@cocrepo/service";
import {
	Controller,
	Get,
	HttpStatus,
	Query,
	UnauthorizedException,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { ClsService } from "nestjs-cls";
import { SubjectResponseDto } from "./dto";

/**
 * Subjects 에러 메시지 상수
 */
const SubjectsErrorMessages = {
	SPACE_NOT_SELECTED:
		"Space가 선택되지 않았습니다. X-Space-ID 헤더를 확인해주세요.",
} as const;

@ApiTags("SUBJECTS")
@Controller()
export class SubjectsController {
	constructor(
		private readonly subjectsService: SubjectsService,
		private readonly cls: ClsService,
	) {}

	/**
	 * 현재 요청의 Space ID를 가져옵니다.
	 * X-Space-ID 헤더에서 추출됩니다.
	 */
	private getSpaceId(): string {
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(SubjectsErrorMessages.SPACE_NOT_SELECTED);
		}
		return spaceId;
	}

	@Get()
	@ApiOperation({
		summary: "모든 Subject 조회",
		description:
			"Tenant에 속한 모든 Subject를 조회합니다. 삭제되지 않은 Subject만 반환됩니다.",
	})
	@ApiAuth()
	@ApiErrors(
		{ status: 401, message: SubjectsErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(SubjectResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("모든 Subject 조회 성공")
	async getAllSubjects(): Promise<SubjectResponseDto[]> {
		const spaceId = this.getSpaceId();

		const subjects = await this.subjectsService.getAllSubjects(spaceId);

		return subjects.map((subject) =>
			plainToInstance(SubjectResponseDto, subject, {
				excludeExtraneousValues: true,
			}),
		);
	}

	@Get("tree")
	@ApiOperation({
		summary: "Subject 계층 구조 조회",
		description:
			"Subject의 계층 구조를 조회합니다. parentId가 제공되면 해당 부모의 하위 트리를 반환하고, 없으면 최상위 Subject와 그 자식들을 반환합니다.",
	})
	@ApiAuth()
	@ApiQuery({
		name: "parentId",
		description: "부모 Subject ID (UUID). 생략 시 최상위 Subject 반환",
		required: false,
		type: String,
	})
	@ApiErrors(
		{ status: 401, message: SubjectsErrorMessages.SPACE_NOT_SELECTED },
		500,
	)
	@ApiResponseEntity(SubjectResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("Subject 계층 구조 조회 성공")
	async getSubjectTree(
		@Query("parentId") parentId?: string,
	): Promise<SubjectResponseDto[]> {
		const spaceId = this.getSpaceId();

		const subjects = await this.subjectsService.getSubjectTree(
			spaceId,
			parentId,
		);

		return subjects.map((subject) =>
			plainToInstance(SubjectResponseDto, subject, {
				excludeExtraneousValues: true,
			}),
		);
	}
}
