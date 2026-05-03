import { LanguageCode } from "@cocrepo/constant";
import { ApiProperty } from "@nestjs/swagger";

export class I18nCatalogResponseDto {
	@ApiProperty({
		description: "언어 코드",
		enum: LanguageCode,
		example: LanguageCode.ko_KR,
	})
	languageCode!: LanguageCode;

	@ApiProperty({
		description: "번역 catalog",
		example: {
			성공: "성공",
			로그아웃: "로그아웃",
		},
	})
	messages!: Record<string, string>;
}
