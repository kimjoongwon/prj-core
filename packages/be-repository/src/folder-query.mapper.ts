import type { GetFoldersQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	removedAtFilter,
	toPrismaOrderBy,
} from "./query-input.mapper";

export function buildFolderQueryWhere(
	input: GetFoldersQueryInput,
	baseWhere?: Prisma.FolderWhereInput,
): Prisma.FolderWhereInput {
	return {
		...(baseWhere ?? {}),
		...(input.parentFolderId !== undefined
			? { parentFolderId: input.parentFolderId }
			: {}),
		...(input.tenantId ? { tenantId: input.tenantId } : {}),
		...(input.name ? { name: containsFilter(input.name) } : {}),
		removedAt: removedAtFilter(input.statusFilter === "deleted"),
	};
}

export function buildFolderQueryOrderBy(input: GetFoldersQueryInput) {
	return toPrismaOrderBy(input.sort, {
		allowedFields: ["createdAt", "name", "sortOrder"],
		defaultOrderBy: [{ path: "asc" }],
	}) as Prisma.FolderOrderByWithRelationInput[];
}
