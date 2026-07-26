import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";
import { SyncPolicyEntryItemDto } from "./sync-policy-entry-item.dto";

export class SyncPolicyEntriesDto {
	@ApiProperty({
		description: "Policy에 포함할 Ability 항목 목록입니다.",
		type: [SyncPolicyEntryItemDto],
	})
	@IsArray({ message: "entries는 배열이어야 합니다" })
	@ValidateNested({ each: true })
	@Type(() => SyncPolicyEntryItemDto)
	entries!: SyncPolicyEntryItemDto[];
}
