export interface SyncUserPolicyInputItem {
	policyId: string;
	isActive?: boolean;
	priority?: number;
}

export interface SyncUserPoliciesCommandInput {
	userPolicies: SyncUserPolicyInputItem[];
}
