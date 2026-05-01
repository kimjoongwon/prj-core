import { RolesGuard } from "@cocrepo/be-common";
import { SYSTEM_ROLES } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
	Roles,
} from "@cocrepo/decorator";
import {
	CreateTranslationDto,
	GetTranslationsDto,
	TranslationResponseDto,
	UpdateTranslationDto,
} from "@cocrepo/dto";
import { TranslationFacade } from "@cocrepo/facade";
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
	UseGuards,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("TRANSLATIONS")
@Controller()
@UseGuards(RolesGuard)
@Roles([SYSTEM_ROLES.FULL_ACCESS])
@ApiAuth()
export class TranslationsController {
	constructor(private readonly translationsService: TranslationFacade) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getTranslations",
		summary: "번역 목록 조회",
		description:
			"번역 목록을 필터링 및 페이지네이션과 함께 조회합니다. FULL_ACCESS 전용.",
	})
	@ApiErrors(401, 403, 500)
	@ApiResponseEntity(TranslationResponseDto, HttpStatus.OK, { isArray: true })
	@ResponseMessage("번역 목록 조회 성공")
	getTranslations(@Query() query: GetTranslationsDto) {
		return this.translationsService.getTranslations(query);
	}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		operationId: "createTranslation",
		summary: "번역 생성",
		description: "새로운 번역을 생성합니다. FULL_ACCESS 전용.",
	})
	@ApiBody({
		type: CreateTranslationDto,
		description: "생성할 번역 정보",
	})
	@ApiErrors(400, 401, 403, 409, 500)
	@ApiResponseEntity(TranslationResponseDto, HttpStatus.CREATED)
	@ResponseMessage("번역 등록 성공")
	createTranslation(@Body() dto: CreateTranslationDto) {
		return this.translationsService.create(dto);
	}

	@Get(":translationId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getTranslationById",
		summary: "번역 조회",
		description: "ID로 특정 번역을 조회합니다. FULL_ACCESS 전용.",
	})
	@ApiParam({
		name: "translationId",
		description: "번역 ID (cuid)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ApiResponseEntity(TranslationResponseDto, HttpStatus.OK)
	@ResponseMessage("번역 조회 성공")
	getTranslationById(@Param("translationId") translationId: string) {
		return this.translationsService.getTranslationById(translationId);
	}

	@Patch(":translationId")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "updateTranslation",
		summary: "번역 수정",
		description: "기존 번역을 수정합니다. FULL_ACCESS 전용.",
	})
	@ApiParam({
		name: "translationId",
		description: "번역 ID (cuid)",
		type: String,
	})
	@ApiBody({
		type: UpdateTranslationDto,
		description: "수정할 번역 정보",
	})
	@ApiErrors(400, 401, 403, 404, 500)
	@ApiResponseEntity(TranslationResponseDto, HttpStatus.OK)
	@ResponseMessage("번역 수정 성공")
	updateTranslation(
		@Param("translationId") translationId: string,
		@Body() dto: UpdateTranslationDto,
	) {
		return this.translationsService.update(translationId, dto);
	}

	@Delete("cache")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "invalidateAllTranslationCache",
		summary: "전체 번역 캐시 무효화",
		description:
			"Redis에 캐시된 모든 번역 데이터를 무효화합니다. FULL_ACCESS 전용.",
	})
	@ApiErrors(401, 403, 500)
	@ResponseMessage("전체 번역 캐시 갱신 성공")
	async invalidateAllTranslationCache(): Promise<void> {
		await this.translationsService.invalidateAllCache();
	}

	@Delete("cache/:languageCode")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "invalidateTranslationCache",
		summary: "언어별 번역 캐시 무효화",
		description:
			"Redis에 캐시된 특정 언어의 번역 데이터를 무효화합니다. FULL_ACCESS 전용.",
	})
	@ApiParam({
		name: "languageCode",
		description: "언어 코드",
		type: String,
	})
	@ApiErrors(401, 403, 500)
	@ResponseMessage("언어별 번역 캐시 갱신 성공")
	async invalidateTranslationCache(
		@Param("languageCode") languageCode: string,
	): Promise<void> {
		await this.translationsService.invalidateLanguageCache(languageCode);
	}

	@Delete(":translationId")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteTranslation",
		summary: "번역 삭제",
		description: "번역을 삭제합니다. FULL_ACCESS 전용.",
	})
	@ApiParam({
		name: "translationId",
		description: "번역 ID (cuid)",
		type: String,
	})
	@ApiErrors(401, 403, 404, 500)
	@ResponseMessage("번역 삭제 성공")
	async deleteTranslation(
		@Param("translationId") translationId: string,
	): Promise<void> {
		await this.translationsService.remove(translationId);
	}
}
