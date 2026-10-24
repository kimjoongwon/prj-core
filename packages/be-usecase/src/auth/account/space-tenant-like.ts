export type SpaceTenantLike = {
	/** 테넌트 공개 ID (ULID) */
	id: string;
	spaceSeq?: bigint | null;
	space?: {
		id?: string | null;
		spaceClassification?: {
			category?: { name?: string | null } | null;
		} | null;
	} | null;
	removedAt?: Date | string | null;
	role?: {
		name?: string | null;
	} | null;
};
