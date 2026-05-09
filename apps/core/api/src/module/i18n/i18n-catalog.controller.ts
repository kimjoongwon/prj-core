import {
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { I18nCatalogResponseDto } from "@cocrepo/dto";
import { TranslationCatalogService } from "@cocrepo/service";
import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@ApiTags("I18N")
@Controller()
export class I18nCatalogController {
	constructor(
		private readonly translationCatalogService: TranslationCatalogService,
	) {}

	@Public()
	@Get("catalog/:languageCode")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getI18nCatalog",
		summary: "공개 i18n catalog 조회",
		description:
			"프론트 런타임 번역에 사용할 언어별 static catalog를 조회합니다.",
	})
	@ApiParam({
		name: "languageCode",
		description: "언어 코드",
		type: String,
	})
	@ApiErrors(400, 500)
	@ApiResponseEntity(I18nCatalogResponseDto, HttpStatus.OK)
	@ResponseMessage("조회 성공")
	getI18nCatalog(@Param("languageCode") languageCode: string) {
		return this.translationCatalogService.getCatalog(languageCode);
	}
}
