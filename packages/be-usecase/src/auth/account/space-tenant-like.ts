export type SpaceTenantLike = {
	id: string;
	spaceId: string;
	role?: {
		name?: string | null;
	} | null;
};
