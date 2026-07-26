export interface TenantWithRelations {
	spaceId: string;
	roleId: string;
	role?: {
		name: string;
		displayName: string | null;
		isSystem: boolean;
	};
	space?: {
		fitnessCenter?: {
			name: string;
		} | null;
	};
}
