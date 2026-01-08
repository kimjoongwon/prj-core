import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

/**
 * Ability 응답 DTO (CASL ABAC 기반)
 */
export class AbilityResponseDto {
	@ApiProperty({
		description: "Ability ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@Expose()
	id!: string;

	@ApiProperty({
		description: "액션 (create, read, update, delete, manage)",
		example: "read",
	})
	@Expose()
	action!: string;

	@ApiProperty({
		description: "대상 Subject (Prisma 모델명 또는 'all')",
		example: "User",
	})
	@Expose()
	subject!: string;

	@ApiProperty({
		description: "대상 필드 목록",
		example: ["email", "name"],
		type: [String],
	})
	@Expose()
	fields!: string[];

	@ApiProperty({
		description: "권한 조건 (JSON 형식)",
		example: { id: "${user.id}" },
		required: false,
		nullable: true,
	})
	@Expose()
	conditions?: Record<string, unknown> | null;

	@ApiProperty({
		description: "거부 권한 여부 (true: cannot, false: can)",
		example: false,
	})
	@Expose()
	inverted!: boolean;

	@ApiProperty({
		description: "거부 사유",
		example: "관리자만 삭제할 수 있습니다",
		required: false,
		nullable: true,
	})
	@Expose()
	reason?: string | null;

	@ApiProperty({
		description: "Role ID (Role 기반 권한일 때)",
		example: "550e8400-e29b-41d4-a716-446655440001",
		required: false,
		nullable: true,
	})
	@Expose()
	roleId?: string | null;

	@ApiProperty({
		description: "User ID (User 예외 권한일 때)",
		example: "550e8400-e29b-41d4-a716-446655440002",
		required: false,
		nullable: true,
	})
	@Expose()
	userId?: string | null;

	@ApiProperty({
		description: "권한 이름",
		example: "본인 정보 조회",
		required: false,
		nullable: true,
	})
	@Expose()
	name?: string | null;

	@ApiProperty({
		description: "권한 설명",
		example: "자신의 프로필 정보만 조회할 수 있습니다",
		required: false,
		nullable: true,
	})
	@Expose()
	description?: string | null;

	@ApiProperty({
		description: "활성화 여부",
		example: true,
	})
	@Expose()
	isActive!: boolean;

	@ApiProperty({
		description: "우선순위 (높을수록 우선)",
		example: 0,
	})
	@Expose()
	priority!: number;

	@ApiProperty({
		description: "생성 일시",
		example: "2025-01-01T00:00:00.000Z",
	})
	@Expose()
	createdAt!: Date;

	@ApiProperty({
		description: "수정 일시",
		example: "2025-01-01T00:00:00.000Z",
		required: false,
		nullable: true,
	})
	@Expose()
	updatedAt?: Date | null;
}
