import { ULIDField } from "@cocrepo/decorator/field";

/** Policy에 포함할 Ability 항목 입력입니다. */
export class SyncPolicyEntryItemDto {
	@ULIDField({
		description: "Policy에 포함할 Ability 공개 ID (ULID)",
		example: "01JABILITY0000000000000000AB",
	})
	abilityId!: string;
}
