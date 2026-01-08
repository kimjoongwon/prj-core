import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

/**
 * Subject 응답 DTO (DMMF 기반)
 */
export class SubjectResponseDto {
	@ApiProperty({
		description: "Subject 이름 (Prisma 모델명)",
		example: "User",
	})
	@Expose()
	name!: string;

	@ApiProperty({
		description: "Subject 표시명 (@displayName 주석)",
		example: "사용자",
		nullable: true,
	})
	@Expose()
	displayName!: string | null;

	@ApiProperty({
		description: "필드 수",
		example: 10,
	})
	@Expose()
	fieldCount!: number;
}

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
