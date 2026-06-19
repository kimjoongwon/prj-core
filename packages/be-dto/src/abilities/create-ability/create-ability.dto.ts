import { ApiProperty } from "@nestjs/swagger";
import {
	IsArray,
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
} from "class-validator";

/**
 * 단일 Ability 생성 DTO (CASL ABAC 기반)
 *
 * @description
 * DDD 원칙에 따라 actionId로 Action을 참조합니다.
 */
export class CreateAbilityDto {
	@ApiProperty({
		description: "Action ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@IsUUID("4", { message: "유효한 Action ID를 입력해주세요" })
	@IsNotEmpty()
	actionId!: string;

	@ApiProperty({
		description: "Subject ID (UUID)",
		example: "550e8400-e29b-41d4-a716-446655440001",
	})
	@IsUUID("4", { message: "유효한 Subject ID를 입력해주세요" })
	@IsNotEmpty()
	subjectId!: string;

	@ApiProperty({
		description: "대상 필드 목록 (빈 배열이면 전체 필드)",
		example: ["email", "name"],
		required: false,
		default: [],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	fields?: string[];

	@ApiProperty({
		description: "권한 조건 (JSON 형식)",
		example: { id: "${user.id}" },
		required: false,
	})
	@IsOptional()
	conditions?: unknown;

	@ApiProperty({
		description: "거부 권한 여부 (true: cannot, false: can)",
		example: false,
		default: false,
		required: false,
	})
	@IsBoolean()
	@IsOptional()
	inverted?: boolean;

	@ApiProperty({
		description: "거부 사유 (inverted=true일 때 사용)",
		example: "관리자만 삭제할 수 있습니다",
		required: false,
	})
	@IsString()
	@IsOptional()
	reason?: string;

	@ApiProperty({
		description: "권한 이름",
		example: "본인 정보 조회",
	})
	@IsString()
	@IsNotEmpty()
	name!: string;

	@ApiProperty({
		description: "권한 설명",
		example: "자신의 프로필 정보만 조회할 수 있습니다",
		required: false,
	})
	@IsString()
	@IsOptional()
	description?: string;
}
