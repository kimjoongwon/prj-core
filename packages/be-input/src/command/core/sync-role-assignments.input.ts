/** Role에 할당할 Policy와 관계 메타데이터입니다. */
export interface SyncRoleAssignmentInputItem {
	policyId: bigint;
	isActive?: boolean;
	priority?: number;
}

/** Role Assignment 전체 동기화 입력입니다. */
export interface SyncRoleAssignmentsCommandInput {
	assignments: SyncRoleAssignmentInputItem[];
}
