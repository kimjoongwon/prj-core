export interface TenantWithRelations {
	spaceSeq: bigint;
	roleSeq: bigint;
	role?: {
		roleSeq: string;
		name: string;
		displayName: string | null;
	};
	space?: {
		spaceSeq: string;
		name: string;
	} | null;
}
