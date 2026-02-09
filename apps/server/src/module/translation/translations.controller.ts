import { TRANSLATION_ERRORS } from "@cocrepo/constant";
import {
	ApiAuth,
	ApiErrors,
	ApiResponseEntity,
	ResponseMessage,
} from "@cocrepo/decorator";
import {
	CreateTranslationDto,
	GetTranslationsDto,
	TranslationResponseDto,
	UpdateTranslationDto,
} from "@cocrepo/dto";
import { TranslationsFacade } from "@cocrepo/facade";
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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";


@ApiTags("TRANSLATIONS")
@Controller()
export class TranslationsController {
	constructor(private readonly translationsFacade: TranslationsFacade) {}

	/**
	 * 번역 목록 조회
	 * GET /api/v1/translations
	 */
	@Get()
	@ApiOperation({
		operationId: "getTranslations",
		summary: "번역 목록 조회",
		description:
			"번역 목록을 필터링 및 페이지네이션과 함께 조회합니다. FULL_ACCESS 전용.",
	})
	@ApiAuth()
	@ApiErrors(500)
	@ApiResponseEntity(TranslationResponseDto, HttpStatus.OK, {
		isArray: true,
	})
	@ResponseMessage("common.translation.list.success")
	async getTranslations(@Query() query: GetTranslationsDto) {
		return this.translationsFacade.getTranslations(query);
	}

	/**
	 * ID로 번역 조회
	 * GET /api/v1/translations/:id
	 */
	@Get(":id")
	@ApiOperation({
		operationId: "getTranslationById",
		summary: "번역 조회",
		description: "ID로 특정 번역을 조회합니다. FULL_ACCESS 전용.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Translation ID (CUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 404, message: TRANSLATION_ERRORS.NOT_FOUND },
		500,
	)
	@ApiResponseEntity(TranslationResponseDto, HttpStatus.OK)
	@ResponseMessage("common.translation.detail.success")
	async getTranslationById(@Param("id") id: string) {
		return this.translationsFacade.getTranslationById(id);
	}

	/**
	 * 번역 생성
	 * POST /api/v1/translations
	 */
	@Post()
	@ApiOperation({
		operationId: "createTranslation",
		summary: "번역 생성",
		description: "새로운 번역을 생성합니다. FULL_ACCESS 전용.",
	})
	@ApiAuth()
	@ApiBody({ type: CreateTranslationDto })
	@ApiErrors(
		{ status: 400, message: TRANSLATION_ERRORS.DUPLICATE_KEY },
		500,
	)
	@ApiResponseEntity(TranslationResponseDto, HttpStatus.CREATED)
	@ResponseMessage("common.translation.create.success")
	async createTranslation(@Body() dto: CreateTranslationDto) {
		return this.translationsFacade.createTranslation(dto);
	}

	/**
	 * 번역 수정
	 * PATCH /api/v1/translations/:id
	 */
	@Patch(":id")
	@ApiOperation({
		operationId: "updateTranslation",
		summary: "번역 수정",
		description: "기존 번역을 수정합니다. FULL_ACCESS 전용.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Translation ID (CUID)",
		type: String,
	})
	@ApiBody({ type: UpdateTranslationDto })
	@ApiErrors(
		{ status: 404, message: TRANSLATION_ERRORS.NOT_FOUND },
		500,
	)
	@ApiResponseEntity(TranslationResponseDto, HttpStatus.OK)
	@ResponseMessage("common.translation.update.success")
	async updateTranslation(
		@Param("id") id: string,
		@Body() dto: UpdateTranslationDto,
	) {
		return this.translationsFacade.updateTranslation(id, dto);
	}

	/**
	 * 번역 삭제
	 * DELETE /api/v1/translations/:id
	 */
	@Delete(":id")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "deleteTranslation",
		summary: "번역 삭제",
		description: "번역을 삭제합니다. FULL_ACCESS 전용.",
	})
	@ApiAuth()
	@ApiParam({
		name: "id",
		description: "Translation ID (CUID)",
		type: String,
	})
	@ApiErrors(
		{ status: 404, message: TRANSLATION_ERRORS.NOT_FOUND },
		500,
	)
	@ResponseMessage("common.translation.delete.success")
	async deleteTranslation(@Param("id") id: string): Promise<void> {
		await this.translationsFacade.deleteTranslation(id);
	}

	/**
	 * 번역 캐시 무효화
	 * DELETE /api/v1/translations/cache
	 */
	@Delete("cache")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "invalidateAllTranslationCache",
		summary: "전체 번역 캐시 무효화",
		description:
			"Redis에 캐시된 모든 번역 데이터를 무효화합니다. FULL_ACCESS 전용.",
	})
	@ApiAuth()
	@ApiErrors(500)
	@ResponseMessage("common.translation.cache.invalidated")
	async invalidateAllCache(): Promise<void> {
		await this.translationsFacade.invalidateCache(undefined as any);
	}

	@Delete("cache/:languageCode")
	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		operationId: "invalidateTranslationCache",
		summary: "언어별 번역 캐시 무효화",
		description:
			"Redis에 캐시된 특정 언어의 번역 데이터를 무효화합니다. FULL_ACCESS 전용.",
	})
	@ApiAuth()
	@ApiParam({
		name: "languageCode",
		description: "언어 코드",
		type: String,
	})
	@ApiErrors(500)
	@ResponseMessage("common.translation.cache.invalidated")
	async invalidateCache(
		@Param("languageCode") languageCode: string,
	): Promise<void> {
		await this.translationsFacade.invalidateCache(
			languageCode as any,
		);
	}
}
