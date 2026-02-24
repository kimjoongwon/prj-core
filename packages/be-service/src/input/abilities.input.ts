import type { JsonValue } from "@cocrepo/type";

/**
 * Abilities Service Input Types
 */
export interface CreateAbilityInput {
	actionId: string;
	subjectId: string;
	fields?: string[];
	conditions?: JsonValue;
	inverted?: boolean;
	reason?: string;
	name: string;
	description?: string;
}

export interface UpdateAbilityInput {
	actionId?: string;
	subjectId?: string;
	fields?: string[];
	conditions?: JsonValue;
	inverted?: boolean;
	reason?: string;
	name?: string;
	description?: string;
}
