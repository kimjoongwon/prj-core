import type { JsonValue } from "@cocrepo/type";

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
