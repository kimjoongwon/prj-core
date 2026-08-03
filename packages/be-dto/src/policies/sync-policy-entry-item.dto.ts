import { BigIntIdField } from "@cocrepo/decorator/field";

/** Policy에 포함할 Ability 항목 입력입니다. */
export class SyncPolicyEntryItemDto {
	@BigIntIdField({
		description: "Policy에 포함할 Ability ID",
		example: "1",
	})
	abilityId!: bigint;
}
