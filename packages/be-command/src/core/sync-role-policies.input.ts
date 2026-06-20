export interface SyncRolePolicyInputItem {
	policyId: string;
	isActive?: boolean;
	priority?: number;
}

export interface SyncRolePoliciesCommandInput {
	rolePolicies: SyncRolePolicyInputItem[];
}
