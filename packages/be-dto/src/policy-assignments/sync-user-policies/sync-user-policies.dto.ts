import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";

import { SyncUserPolicyItemDto } from "../sync-user-policy-item.dto";

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
