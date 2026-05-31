import { ApiProperty } from "@nestjs/swagger";

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
