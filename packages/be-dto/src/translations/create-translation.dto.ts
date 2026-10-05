import { LanguageCode } from "@cocrepo/constant";
import { Translation } from "@cocrepo/entity";
import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

/**
 * 번역 생성 DTO
 */
export class CreateTranslationDto extends PickType(Translation, [
	"languageCode",
] as const) {
	// 기존 번역 API는 언어 코드를 별도 enum schema 없이 인라인으로 문서화합니다.
	@ApiProperty({
		description: "언어 코드",
		type: String,
		enum: LanguageCode,
		enumName: undefined,
		example: "ko_KR",
	})
	declare languageCode: LanguageCode;

	@ApiProperty({
		description: "번역 키 (예: 성공, 번역 목록 조회 성공)",
		example: "성공",
	})
	@IsString()
	@IsNotEmpty()
	key!: string;

	@ApiProperty({
		description: "번역된 텍스트",
		example: "성공",
	})
	@IsString()
	@IsNotEmpty()
	text!: string;

	@ApiProperty({
		description: "카테고리 (common, error, validation, menu, role)",
		example: "common",
	})
	@IsString()
	@IsNotEmpty()
	category!: string;

	@ApiProperty({
		description: "번역 완료 여부",
		default: false,
	})
	@IsBoolean()
	isTranslated!: boolean;
}
