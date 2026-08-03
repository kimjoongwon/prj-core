export interface CreateAbilityInput {
	actionId: bigint;
	subjectId: bigint;
	fields?: string[];
	conditions?: unknown;
	inverted?: boolean;
	reason?: string | null;
	name: string;
	description?: string | null;
}
