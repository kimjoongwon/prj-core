import { ULIDField } from "@cocrepo/decorator";
import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class SyncRoleAssignmentItemDto {
	@ULIDField({
		description: "Policy ID (Role에 할당할 정책)",
		example: "01J00000000000000000000000",
	})
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
		example: 0,
		default: 0,
		required: false,
	})
	@IsNumber({}, { message: "우선순위는 숫자여야 합니다" })
	@IsOptional()
	priority?: number;
}
