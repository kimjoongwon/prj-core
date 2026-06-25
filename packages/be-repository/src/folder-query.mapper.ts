import type { GetFoldersQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	createQueryOrderByBuilder,
	removedAtFilter,
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

export const buildFolderQueryOrderBy = createQueryOrderByBuilder<
	GetFoldersQueryInput,
	Prisma.FolderOrderByWithRelationInput
>({
	allowedFields: ["createdAt", "name", "sortOrder"],
	defaultOrderBy: [{ path: "asc" }],
});
