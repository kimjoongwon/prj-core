import type { JsonValue } from "@cocrepo/type";

export interface CreateActionCommandInput {
	name: string;
	displayName?: string | null;
	description?: string | null;
	group?: string | null;
	order: number;
	config?: JsonValue | null;
}
