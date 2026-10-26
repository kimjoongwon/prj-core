import { ApiProperty } from "@nestjs/swagger";

export class InquiryFormUiPathsDto {
	@ApiProperty({
		description: "읽기 전용 경로 목록",
		type: [String],
		example: ["inquiryNumber"],
	})
	readOnlyPaths!: string[];

	@ApiProperty({
		description: "숨김 경로 목록",
		type: [String],
		example: ["content"],
	})
	hiddenPaths!: string[];

	@ApiProperty({
		description: "비활성 경로 목록",
		type: [String],
		example: ["customerId"],
	})
	disabledPaths!: string[];
}
