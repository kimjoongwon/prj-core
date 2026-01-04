import { SubjectTypes } from "@cocrepo/prisma";
import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

/**
 * Subject 응답 DTO
 * Ability 응답에 중첩되어 사용됩니다.
 */
export class SubjectResponseDto {
	@ApiProperty({
		description: "Subject ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: "Subject 이름",
		example: "회원 관리",
	})
	@Expose()
	name!: string;

	@ApiProperty({
		description: "Subject 타입",
		enum: SubjectTypes,
		example: SubjectTypes.Menu,
	})
	@Expose()
	type!: SubjectTypes;

	@ApiProperty({
		description: "Subject 레이블",
		example: "회원 관리 메뉴",
		required: false,
		nullable: true,
	})
	@Expose()
	label?: string | null;

	@ApiProperty({
		description: "Subject 설명",
		example: "회원 정보를 관리하는 메뉴",
		required: false,
		nullable: true,
	})
	@Expose()
	description?: string | null;

	@ApiProperty({
		description: "부모 Subject ID",
		example: "550e8400-e29b-41d4-a716-446655440001",
		required: false,
		nullable: true,
	})
	@Expose()
	parentId?: string | null;

	@ApiProperty({
		description: "정렬 순서",
		example: 1,
	})
	@Expose()
	sortOrder!: number;
}
