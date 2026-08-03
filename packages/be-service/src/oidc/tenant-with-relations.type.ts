export interface TenantWithRelations {
	spaceId: string;
	roleId: string;
	role?: {
		name: string;
		displayName: string | null;
	};
	space?: {
		fitnessCenter?: {
			name: string;
		} | null;
	};
}
