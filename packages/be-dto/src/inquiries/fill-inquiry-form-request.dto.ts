import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	ArrayNotEmpty,
	IsArray,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
} from "class-validator";

export class FillInquiryFormRequestDto {
	@ApiProperty({
		description: "폼 모드",
		enum: ["CREATE", "UPDATE"],
		example: "CREATE",
	})
	@IsString()
	@IsNotEmpty()
	mode!: "CREATE" | "UPDATE";

	@ApiProperty({
		description: "선택한 AI 스키마 키",
		example: "inquiry-intake-basic",
	})
	@IsString()
	@IsNotEmpty()
	schemaKey!: string;

	@ApiProperty({
		description: "선택한 경로 목록",
		type: [String],
		example: ["title", "category", "priority"],
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	selectedPaths!: string[];

	@ApiProperty({
		description: "현재 폼 객체",
		type: "object",
		additionalProperties: true,
	})
	@IsObject()
	currentObject!: Record<string, unknown>;

	@ApiPropertyOptional({
		description: "추가 프롬프트",
		example: "고객이 배송 지연으로 매우 불만인 상황",
	})
	@IsOptional()
	@IsString()
	userPrompt?: string;
}
