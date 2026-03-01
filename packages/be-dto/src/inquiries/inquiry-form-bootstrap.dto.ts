import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
	ArrayNotEmpty,
	IsArray,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
} from "class-validator";

export class InquiryFormOptionItemDto {
	@ApiProperty({
		description: "옵션 값",
		example: "GENERAL",
		oneOf: [
			{ type: "string" },
			{ type: "number" },
			{ type: "boolean" },
			{ type: "null" },
		],
	})
	value!: string | number | boolean | null;

	@ApiProperty({ description: "옵션 라벨", example: "일반 문의" })
	label!: string;
}

export class InquiryFormUiPathsDto {
	@ApiProperty({
		description: "읽기 전용 경로 목록",
		type: [String],
		example: ["inquiryNumber"],
	})
	readOnlyPaths!: string[];

	@ApiProperty({
		description: "숨김 경로 목록",
		type: [String],
		example: ["content"],
	})
	hiddenPaths!: string[];

	@ApiProperty({
		description: "비활성 경로 목록",
		type: [String],
		example: ["customerId"],
	})
	disabledPaths!: string[];
}

export class InquiryFormFieldAiMetaDto {
	@ApiProperty({ description: "AI 채움 가능 여부", example: true })
	fillable!: boolean;

	@ApiPropertyOptional({
		description: "기본 선택 여부",
		example: true,
	})
	defaultChecked?: boolean;

	@ApiPropertyOptional({
		description: "AI 채움 제한 사유",
		example: "운영 정책으로 자동 채움 제외",
	})
	reason?: string;
}

export class InquiryFormFieldMetaDto {
	@ApiPropertyOptional({
		description: "필드 라벨",
		example: "문의 제목",
	})
	label?: string;

	@ApiPropertyOptional({
		description: "AI 메타 정보",
		type: InquiryFormFieldAiMetaDto,
	})
	ai?: InquiryFormFieldAiMetaDto;
}

export class InquiryFormSchemaDto {
	@ApiProperty({
		description: "스키마 키",
		example: "inquiry-intake-basic",
	})
	key!: string;

	@ApiProperty({
		description: "스키마 라벨",
		example: "문의 접수 기본",
	})
	label!: string;

	@ApiProperty({
		description: "스키마 대상 경로",
		type: [String],
		example: ["title", "category", "priority", "content"],
	})
	paths!: string[];

	@ApiPropertyOptional({
		description: "스키마 설명",
		example: "문의 접수에 필요한 핵심 필드를 자동 채움합니다.",
	})
	description?: string;
}

export class InquiryCreateUpdateFormBootstrapDto {
	@ApiProperty({
		description: "폼 모드",
		enum: ["CREATE", "UPDATE"],
		example: "CREATE",
	})
	mode!: "CREATE" | "UPDATE";

	@ApiProperty({
		description: "초기 폼 객체",
		type: "object",
		additionalProperties: true,
	})
	defaultObject!: Record<string, unknown>;

	@ApiProperty({
		description: "경로별 선택 옵션",
		type: "object",
		additionalProperties: {
			type: "array",
			items: { $ref: "#/components/schemas/InquiryFormOptionItemDto" },
		},
	})
	options!: Record<string, InquiryFormOptionItemDto[]>;

	@ApiProperty({
		description: "UI 제어 경로",
		type: InquiryFormUiPathsDto,
	})
	ui!: InquiryFormUiPathsDto;

	@ApiProperty({
		description: "경로별 필드 메타",
		type: "object",
		additionalProperties: {
			$ref: "#/components/schemas/InquiryFormFieldMetaDto",
		},
	})
	fieldMeta!: Record<string, InquiryFormFieldMetaDto>;

	@ApiProperty({
		description: "AI 스키마 목록",
		type: [InquiryFormSchemaDto],
	})
	aiSchemas!: InquiryFormSchemaDto[];
}

export class InquiryAiFormPatchDto {
	@ApiProperty({
		description: "적용 경로",
		example: "title",
	})
	path!: string;

	@ApiProperty({
		description: "적용 값",
		type: "object",
		additionalProperties: true,
		nullable: true,
	})
	value!: unknown;
}

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

export class FillInquiryFormResponseDto {
	@ApiProperty({
		description: "AI가 생성한 patch 목록",
		type: [InquiryAiFormPatchDto],
	})
	patches!: InquiryAiFormPatchDto[];
}
