import type { Prisma } from "@cocrepo/prisma";

export interface UpdateActionCommandInput {
	name?: string;
	displayName?: string;
	description?: string;
	group?: string;
	order?: number;
	isSystem?: boolean;
	config?: Prisma.JsonValue | null;
}
