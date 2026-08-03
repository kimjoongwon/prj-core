export interface TenantWithRelations {
	spaceId: bigint;
	roleId: bigint;
	role?: {
		roleId: string;
		name: string;
		displayName: string | null;
	};
	space?: {
		spaceId: string;
		fitnessCenter?: {
			name: string;
		} | null;
	};
}
