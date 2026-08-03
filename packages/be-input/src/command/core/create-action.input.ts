import type { JsonValue } from "@cocrepo/type";

export interface CreateActionCommandInput {
	name: string;
	displayName: string;
	description: string;
	group: string;
	order: number;
	config: JsonValue | null;
}
