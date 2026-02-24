import type { JsonValue } from "@cocrepo/type";

export interface UpdateActionInput {
	name?: string;
	displayName?: string | null;
	description?: string | null;
	group?: string | null;
	order?: number;
	isSystem?: boolean;
	config?: JsonValue;
}
