import type { JsonValue } from "@cocrepo/type";

export interface CreateActionCommandInput {
	name: string;
	displayName: string;
	description: string;
	group: string;
	order: number;
	isSystem: boolean;
	config: JsonValue | null;
}
