import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";

import { SyncRolePolicyItemDto } from "../sync-role-policy-item.dto";

export class SyncRolePoliciesDto {
	@ApiProperty({
		description:
			"Role에 연결할 Policy 목록입니다. 전체 동기화 방식으로 반영됩니다.",
		type: [SyncRolePolicyItemDto],
	})
	@IsArray({ message: "rolePolicies는 배열이어야 합니다" })
	@ValidateNested({ each: true })
	@Type(() => SyncRolePolicyItemDto)
	rolePolicies!: SyncRolePolicyItemDto[];
}
