import { ApiPropertyOptional } from "@nestjs/swagger";

export class InquiryFormFieldMetaDto {
	@ApiPropertyOptional({
		description: "필드 라벨",
		example: "문의 제목",
	})
	label?: string;
}
