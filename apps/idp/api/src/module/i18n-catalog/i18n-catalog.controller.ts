import { LanguageCode } from "@cocrepo/constant";
import {
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { TranslationCatalogResponseDto } from "@cocrepo/dto";
import { TranslationFacade } from "@cocrepo/facade";
import type { LanguageCode as PrismaLanguageCode } from "@cocrepo/prisma";
import {
	Controller,
	Get,
	HttpStatus,
	Param,
	ParseEnumPipe,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("I18N")
@Public()
@Controller()
export class I18nCatalogController {
	constructor(private readonly translationFacade: TranslationFacade) {}

	@Get("catalog/:languageCode")
	@ApiOperation({
		operationId: "getI18nCatalog",
		summary: "런타임 번역 catalog 조회",
		description:
			"인증 없이 사용할 수 있는 정적 번역 key-value catalog를 언어별로 조회합니다.",
	})
	@ApiParam({
		name: "languageCode",
		description: "언어 코드",
		enum: LanguageCode,
		example: LanguageCode.ko_KR,
	})
	@ApiErrors(400, 500)
	@ApiResponseEntity(TranslationCatalogResponseDto, HttpStatus.OK)
	@ResponseMessage("번역 catalog 조회 성공")
	getI18nCatalog(
		@Param("languageCode", new ParseEnumPipe(LanguageCode))
		languageCode: PrismaLanguageCode,
	): Promise<TranslationCatalogResponseDto> {
		return this.translationFacade.getCatalog(languageCode);
	}
}
