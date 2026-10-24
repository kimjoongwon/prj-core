export interface CreateAbilityCommandInput {
	actionSeq: bigint;
	subjectSeq: bigint;
	fields?: string[];
	conditions?: unknown;
	inverted?: boolean;
	reason?: string | null;
	name: string;
	description?: string | null;
}
