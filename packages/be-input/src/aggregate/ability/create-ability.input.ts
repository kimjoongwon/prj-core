export interface CreateAbilityInput {
	actionId: string;
	subjectId: string;
	fields?: string[];
	conditions?: unknown;
	inverted?: boolean;
	reason?: string | null;
	name: string;
	description?: string | null;
}
