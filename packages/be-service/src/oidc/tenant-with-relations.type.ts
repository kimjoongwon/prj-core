export interface TenantWithRelations {
	spaceSeq: bigint;
	roleSeq: bigint;
	role?: {
		id: string;
		name: string;
		displayName: string | null;
	};
	space?: {
		id: string;
		name?: string | null;
	} | null;
}
