import { ApiPropertyOptional } from "@nestjs/swagger";

import { InquiryFormFieldAiMetaDto } from "./inquiry-form-field-ai-meta.dto";

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
