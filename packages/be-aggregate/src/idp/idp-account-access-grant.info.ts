export interface IdpAccountAccessGrantInfo {
	tenantId: string;
	spaceId: string;
	spaceName: string;
	spaceLabel: string | null;
	roleId: string;
	roleName: string;
	roleDisplayName: string | null;
	grantedAt: Date;
	updatedAt: Date | null;
}
