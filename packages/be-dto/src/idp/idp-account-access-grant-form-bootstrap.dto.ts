import { ApiProperty } from "@nestjs/swagger";

import { IdpAccountAccessGrantFormFieldMetaDto } from "./idp-account-access-grant-form-field-meta.dto";
import { IdpAccountAccessGrantFormOptionItemDto } from "./idp-account-access-grant-form-option-item.dto";
import { IdpAccountAccessGrantFormSchemaDto } from "./idp-account-access-grant-form-schema.dto";
import { IdpAccountAccessGrantFormUiPathsDto } from "./idp-account-access-grant-form-ui-paths.dto";

export class IdpAccountAccessGrantFormBootstrapDto {
	@ApiProperty({
		description: "폼 모드",
		enum: ["CREATE"],
		example: "CREATE",
	})
	mode!: "CREATE";

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
			items: {
				$ref: "#/components/schemas/IdpAccountAccessGrantFormOptionItemDto",
			},
		},
	})
	options!: Record<string, IdpAccountAccessGrantFormOptionItemDto[]>;

	@ApiProperty({
		description: "UI 제어 경로",
		type: IdpAccountAccessGrantFormUiPathsDto,
	})
	ui!: IdpAccountAccessGrantFormUiPathsDto;

	@ApiProperty({
		description: "경로별 필드 메타",
		type: "object",
		additionalProperties: {
			$ref: "#/components/schemas/IdpAccountAccessGrantFormFieldMetaDto",
		},
	})
	fieldMeta!: Record<string, IdpAccountAccessGrantFormFieldMetaDto>;

	@ApiProperty({
		description: "AI 스키마 목록",
		type: [IdpAccountAccessGrantFormSchemaDto],
	})
	aiSchemas!: IdpAccountAccessGrantFormSchemaDto[];
}
