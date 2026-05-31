import { ApiProperty } from "@nestjs/swagger";

import { InquiryAiFormPatchDto } from "./inquiry-ai-form-patch.dto";

export class FillInquiryFormResponseDto {
	@ApiProperty({
		description: "AI가 생성한 patch 목록",
		type: [InquiryAiFormPatchDto],
	})
	patches!: InquiryAiFormPatchDto[];
}
