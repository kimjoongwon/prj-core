import { LanguageCode } from "@cocrepo/constant";
import { ApiProperty } from "@nestjs/swagger";

/**
 * 번역 응답 DTO
 */
export class TranslationResponseDto {
	@ApiProperty({
		description: "번역 ID",
		example: "clxxx12345",
	})
	id!: string;

	@ApiProperty({
		description: "언어 코드",
		enum: LanguageCode,
		example: "ko_KR",
	})
	languageCode!: LanguageCode;

	@ApiProperty({
		description: "번역 키",
		example: "성공",
	})
	key!: string;

	@ApiProperty({
		description: "번역된 텍스트",
		example: "성공",
	})
	text!: string;

	@ApiProperty({
		description: "카테고리",
		example: "공통",
	})
	category!: string;

	@ApiProperty({
		description: "번역 완료 여부",
		example: true,
	})
	isTranslated!: boolean;

	@ApiProperty({
		description: "생성일시",
		type: Date,
	})
	createdAt!: Date;

	@ApiProperty({
		description: "수정일시",
		type: Date,
		nullable: true,
	})
	updatedAt!: Date | null;
}
