import type { JsonValue } from "@cocrepo/type";

export interface UpdateActionCommandInput {
	name?: string;
	displayName?: string | null;
	description?: string | null;
	group?: string | null;
	order?: number;
	config?: JsonValue | null;
}
