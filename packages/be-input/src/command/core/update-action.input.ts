import type { JsonValue } from "@cocrepo/type";

export interface UpdateActionCommandInput {
	name?: string;
	displayName?: string;
	description?: string;
	group?: string;
	order?: number;
	isSystem?: boolean;
	config?: JsonValue | null;
}
