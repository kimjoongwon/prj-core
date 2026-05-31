import { ApiProperty } from "@nestjs/swagger";

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
