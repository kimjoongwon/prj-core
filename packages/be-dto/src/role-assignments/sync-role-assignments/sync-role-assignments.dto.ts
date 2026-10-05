import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";

import { SyncRoleAssignmentItemDto } from "../sync-role-assignment-item.dto";

export class SyncRoleAssignmentsDto {
	@ApiProperty({
		description:
			"Role에 연결할 Policy 목록입니다. 전체 동기화 방식으로 반영됩니다.",
		type: [SyncRoleAssignmentItemDto],
	})
	@IsArray({ message: "assignments는 배열이어야 합니다" })
	@ValidateNested({ each: true })
	@Type(() => SyncRoleAssignmentItemDto)
	assignments!: SyncRoleAssignmentItemDto[];
}
