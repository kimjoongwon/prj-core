import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

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
