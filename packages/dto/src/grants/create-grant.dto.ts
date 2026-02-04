import { ApiProperty } from "@nestjs/swagger";
import {
	IsBoolean,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsUUID,
} from "class-validator";

/**
 * Grantee Type Enum (권한 대상 유형)
 */
export enum GranteeTypeEnum {
	Role = "Role",
	User = "User",
}

/**
 * Grant 생성 DTO
 *
 * @description
 * Role 또는 User에게 Ability를 할당합니다.
 * - Role 권한: priority 기본값 0
 * - User 권한: priority 기본값 10 (Role보다 우선)
 */
export class CreateGrantDto {
	@ApiProperty({
		description: "권한 대상 유형 (Role 또는 User)",
		enum: GranteeTypeEnum,
		example: GranteeTypeEnum.Role,
	})
	@IsNotEmpty({ message: "권한 대상 유형을 입력해주세요" })
	@IsEnum(GranteeTypeEnum, { message: "유효한 권한 대상 유형을 선택해주세요" })
	granteeType!: GranteeTypeEnum;

	@ApiProperty({
		description: "권한 대상 ID (Role ID 또는 User ID)",
		example: "550e8400-e29b-41d4-a716-446655440000",
	})
	@IsNotEmpty({ message: "권한 대상 ID를 입력해주세요" })
	@IsUUID("4", { message: "유효한 UUID 형식이 아닙니다" })
	granteeId!: string;

	@ApiProperty({
		description: "Ability ID (부여할 권한)",
		example: "550e8400-e29b-41d4-a716-446655440001",
	})
	@IsNotEmpty({ message: "Ability ID를 입력해주세요" })
	@IsUUID("4", { message: "유효한 UUID 형식이 아닙니다" })
	abilityId!: string;

	@ApiProperty({
		description: "활성화 여부",
		example: true,
		default: true,
		required: false,
	})
	@IsBoolean({ message: "활성화 여부는 boolean 타입이어야 합니다" })
	@IsOptional()
	isActive?: boolean;

	@ApiProperty({
		description:
			"우선순위 (높을수록 우선, Role: 0-9, User: 10+, 기본값: Role=0, User=10)",
		example: 0,
		default: 0,
		required: false,
	})
	@IsNumber({}, { message: "우선순위는 숫자여야 합니다" })
	@IsOptional()
	priority?: number;
}
