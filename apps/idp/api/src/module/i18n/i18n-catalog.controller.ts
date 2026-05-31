import {
	ApiErrors,
	ApiResponseEntity,
	Public,
	ResponseMessage,
} from "@cocrepo/decorator";
import { I18nCatalogResponseDto } from "@cocrepo/dto";
import { Controller, Get, HttpCode, HttpStatus, Param } from "@nestjs/common";
import { QueryBus } from "@nestjs/cqrs";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { GetIdpI18nCatalogQuery } from "@cocrepo/command";

@ApiTags("I18N")
@Controller()
export class I18nCatalogController {
	constructor(private readonly queryBus: QueryBus) {}

	@Public()
	@Get("catalog/:languageCode")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		operationId: "getIdpI18nCatalog",
		summary: "공개 IDP i18n catalog 조회",
		description:
			"IDP 프론트 런타임 번역에 사용할 언어별 static catalog를 조회합니다.",
	})
	@ApiParam({
		name: "languageCode",
		description: "언어 코드",
		type: String,
	})
	@ApiErrors(400, 500)
	@ApiResponseEntity(I18nCatalogResponseDto, HttpStatus.OK)
	@ResponseMessage("조회 성공")
	getIdpI18nCatalog(@Param("languageCode") languageCode: string) {
		return this.queryBus.execute(new GetIdpI18nCatalogQuery(languageCode));
	}
}
