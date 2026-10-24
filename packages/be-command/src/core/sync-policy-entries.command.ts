/** Policy Entry 동기화에 사용할 Ability 식별자입니다. */
export interface SyncPolicyEntryInput {
	abilitySeq: bigint;
}

/** Policy의 Entry 목록을 전체 동기화합니다. */
export class SyncPolicyEntriesCommand {
	constructor(
		readonly policySeq: bigint,
		readonly entries: SyncPolicyEntryInput[],
	) {}
}
