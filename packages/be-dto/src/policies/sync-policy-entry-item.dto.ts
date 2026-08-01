import { ULIDField } from "@cocrepo/decorator";

/** Policy에 포함할 Ability 항목 입력입니다. */
export class SyncPolicyEntryItemDto {
	@ULIDField({
		description: "Policy에 포함할 Ability ID",
		example: "01J00000000000000000000000",
	})
	abilityId!: string;
}
