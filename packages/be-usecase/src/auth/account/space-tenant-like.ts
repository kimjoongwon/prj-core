export type SpaceTenantLike = {
	id: bigint;
	spaceId: bigint;
	removedAt?: Date | string | null;
	role?: {
		name?: string | null;
	} | null;
};
