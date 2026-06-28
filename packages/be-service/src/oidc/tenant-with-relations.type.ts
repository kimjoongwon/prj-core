export interface TenantWithRelations {
	spaceId: string;
	roleId: string;
	role?: {
		name: string;
		displayName: string | null;
		isSystem: boolean;
	};
	space?: {
		company?: {
			ground?: {
				name: string;
			} | null;
		};
	};
}
