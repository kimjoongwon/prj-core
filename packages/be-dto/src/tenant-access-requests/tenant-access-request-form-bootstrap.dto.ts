import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TenantAccessRequestFormOptionItemDto {
	@ApiProperty({
		description: "옵션 값",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	value!: string;

	@ApiProperty({ description: "옵션 라벨", example: "본사" })
	label!: string;

	@ApiPropertyOptional({
		description: "보조 설명",
		example: "서울 강남구",
	})
	description?: string;
}

export class TenantAccessRequestFormUiPathsDto {
	@ApiProperty({ description: "읽기 전용 경로 목록", type: [String] })
	readOnlyPaths!: string[];

	@ApiProperty({ description: "숨김 경로 목록", type: [String] })
	hiddenPaths!: string[];

	@ApiProperty({ description: "비활성 경로 목록", type: [String] })
	disabledPaths!: string[];
}

export class TenantAccessRequestFormFieldMetaDto {
	@ApiPropertyOptional({ description: "필드 라벨", example: "Space" })
	label?: string;
}

export class TenantAccessRequestFormSchemaDto {
	@ApiProperty({ description: "스키마 키", example: "tenant-access-basic" })
	key!: string;

	@ApiProperty({ description: "스키마 라벨", example: "접근 신청 기본" })
	label!: string;

	@ApiProperty({ description: "스키마 대상 경로", type: [String] })
	paths!: string[];
}

export class TenantAccessRequestCreateFormBootstrapDto {
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
				$ref: "#/components/schemas/TenantAccessRequestFormOptionItemDto",
			},
		},
	})
	options!: Record<string, TenantAccessRequestFormOptionItemDto[]>;

	@ApiProperty({
		description: "UI 제어 경로",
		type: TenantAccessRequestFormUiPathsDto,
	})
	ui!: TenantAccessRequestFormUiPathsDto;

	@ApiProperty({
		description: "경로별 필드 메타",
		type: "object",
		additionalProperties: {
			$ref: "#/components/schemas/TenantAccessRequestFormFieldMetaDto",
		},
	})
	fieldMeta!: Record<string, TenantAccessRequestFormFieldMetaDto>;

	@ApiProperty({
		description: "AI 스키마 목록",
		type: [TenantAccessRequestFormSchemaDto],
	})
	aiSchemas!: TenantAccessRequestFormSchemaDto[];
}
