import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

/**
 * Subject 필드 응답 DTO
 */
export class SubjectFieldResponseDto {
	@ApiProperty({
		description: "필드 이름",
		example: "email",
	})
	@Expose()
	name!: string;

	@ApiProperty({
		description: "필드 표시명 (@displayName 주석)",
		example: "이메일",
		nullable: true,
	})
	@Expose()
	displayName!: string | null;

	@ApiProperty({
		description: "필드 타입",
		example: "String",
	})
	@Expose()
	type!: string;

	@ApiProperty({
		description: "필수 여부",
		example: true,
	})
	@Expose()
	isRequired!: boolean;

	@ApiProperty({
		description: "관계 필드 여부",
		example: false,
	})
	@Expose()
	isRelation!: boolean;
}
