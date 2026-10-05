import type { SyncRoleAssignmentsCommandInput } from "@cocrepo/input";

/** Role의 Policy Assignment 목록을 전체 동기화합니다. */
export class SyncRoleAssignmentsCommand
	implements SyncRoleAssignmentsCommandInput
{
	readonly assignments!: SyncRoleAssignmentsCommandInput["assignments"];

	constructor(
		readonly roleId: bigint,
		input: SyncRoleAssignmentsCommandInput,
	) {
		Object.assign(this, input);
	}
}
