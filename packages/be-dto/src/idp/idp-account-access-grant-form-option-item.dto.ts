import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class IdpAccountAccessGrantFormOptionItemDto {
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
