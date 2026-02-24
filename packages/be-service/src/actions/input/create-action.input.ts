import type { JsonValue } from "@cocrepo/type";

/**
 * Actions Service Input Types
 */
export interface CreateActionInput {
	name: string;
	displayName?: string | null;
	description?: string | null;
	group?: string | null;
	order?: number;
	isSystem?: boolean;
	config?: JsonValue;
}
