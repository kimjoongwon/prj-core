export type SpaceTenantLike = {
	id: string;
	spaceId: string;
	removedAt?: Date | string | null;
	role?: {
		name?: string | null;
	} | null;
};
