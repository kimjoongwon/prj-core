import { LanguageCode } from "@cocrepo/constant";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsBoolean,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	Max,
	Min,
} from "class-validator";

/**
 * 번역 목록 조회 쿼리 DTO
 */
export class GetTranslationsDto {
	@ApiProperty({
		description: "언어 코드",
		enum: LanguageCode,
		required: false,
		example: "ko_KR",
	})
	@IsEnum(LanguageCode)
	@IsOptional()
	languageCode?: LanguageCode;

	@ApiProperty({
		description: "카테고리",
		required: false,
		example: "common",
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

	@ApiProperty({
		description: "번역 키 검색 (부분 일치)",
		required: false,
		example: "common.success",
	})
	@IsString()
	@IsOptional()
	key?: string;

	@ApiProperty({
		description: "페이지 번호",
		minimum: 1,
		default: 1,
		required: false,
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@IsOptional()
	page?: number = 1;

	@ApiProperty({
		description: "페이지당 항목 수",
		minimum: 1,
		maximum: 100,
		default: 20,
		required: false,
	})
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	@IsOptional()
	limit?: number = 20;
}
