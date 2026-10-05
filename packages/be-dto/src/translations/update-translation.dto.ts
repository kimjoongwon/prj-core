import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

/**
 * 번역 수정 DTO
 */
export class UpdateTranslationDto {
	@ApiProperty({
		description: "번역된 텍스트",
		example: "성공",
		required: false,
	})
	@IsString()
	@IsOptional()
	text?: string;

	@ApiProperty({
		description: "카테고리",
		example: "common",
		required: false,
	})
	@IsString()
	@IsOptional()
	category?: string;

	@ApiProperty({
		description: "번역 완료 여부",
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	isTranslated?: boolean;
}
