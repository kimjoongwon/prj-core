import type { Prisma } from "@cocrepo/prisma";

export interface GetUsersInput {
	where: Prisma.UserWhereInput;
	orderBy: Record<string, "asc" | "desc">[];
	skip?: number;
	take?: number;
	roles?: string[];
}
