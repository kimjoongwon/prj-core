import { LanguageCode } from "@cocrepo/constant";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 런타임 번역 catalog 응답 DTO
 */
export class TranslationCatalogResponseDto {
	@ApiProperty({
		description: "언어 코드",
		enum: LanguageCode,
		example: "ko_KR",
	})
	languageCode!: LanguageCode;

	@ApiProperty({
		description: "번역 key-value catalog",
		type: "object",
		additionalProperties: { type: "string" },
		example: {
			성공: "성공",
			로그아웃: "로그아웃",
		},
	})
	messages!: Record<string, string>;
}
