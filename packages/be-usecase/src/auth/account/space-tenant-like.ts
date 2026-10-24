export type SpaceTenantLike = {
	id: bigint;
	spaceSeq: bigint;
	removedAt?: Date | string | null;
	role?: {
		name?: string | null;
	} | null;
};
