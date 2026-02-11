import { LanguageCode } from "@cocrepo/constant";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";

/**
 * 번역 생성 DTO
 */
export class CreateTranslationDto {
	@ApiProperty({
		description: "언어 코드",
		enum: LanguageCode,
		example: "ko_KR",
	})
	@IsEnum(LanguageCode)
	@IsNotEmpty()
	languageCode!: LanguageCode;

	@ApiProperty({
		description: "번역 키 (예: common.success, error.prisma.P2002)",
		example: "common.success",
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
