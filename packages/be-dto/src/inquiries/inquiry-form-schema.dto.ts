import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
