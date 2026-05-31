import { ApiProperty } from "@nestjs/swagger";

import { InquiryFormFieldMetaDto } from "./inquiry-form-field-meta.dto";
import { InquiryFormOptionItemDto } from "./inquiry-form-option-item.dto";
import { InquiryFormSchemaDto } from "./inquiry-form-schema.dto";
import { InquiryFormUiPathsDto } from "./inquiry-form-ui-paths.dto";

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
