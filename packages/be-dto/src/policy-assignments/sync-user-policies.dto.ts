import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsBoolean,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsUUID,
	ValidateNested,
} from "class-validator";

export class SyncUserPolicyItemDto {
	@ApiProperty({
		description: "Policy ID (User에 할당할 예외 정책)",
		example: "550e8400-e29b-41d4-a716-446655440001",
	})
	@IsNotEmpty({ message: "Policy ID를 입력해주세요" })
	@IsUUID("4", { message: "유효한 UUID 형식이 아닙니다" })
	policyId!: string;

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
		description: "우선순위 (높을수록 우선)",
		example: 10,
		default: 10,
		required: false,
	})
	@IsNumber({}, { message: "우선순위는 숫자여야 합니다" })
	@IsOptional()
	priority?: number;
}

export class SyncUserPoliciesDto {
	@ApiProperty({
		description:
			"User에 연결할 Policy 목록입니다. 전체 동기화 방식으로 반영됩니다.",
		type: [SyncUserPolicyItemDto],
	})
	@IsArray({ message: "userPolicies는 배열이어야 합니다" })
	@ValidateNested({ each: true })
	@Type(() => SyncUserPolicyItemDto)
	userPolicies!: SyncUserPolicyItemDto[];
}
