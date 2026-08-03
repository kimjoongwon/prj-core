import type { GetAssetsQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	createQueryOrderByBuilder,
	removedAtFilter,
} from "./query-input.mapper";

export function buildAssetQueryWhere(
	input: GetAssetsQueryInput,
	baseWhere?: Prisma.AssetWhereInput,
): Prisma.AssetWhereInput {
	return {
		...(baseWhere ?? {}),
		...(input.folderId ? { folderId: input.folderId } : {}),
		...(input.spaceId ? { spaceId: input.spaceId } : {}),
		...(input.kind ? { kind: input.kind } : {}),
		...(input.status ? { status: input.status } : {}),
		...(input.search ? { originalName: containsFilter(input.search) } : {}),
		removedAt: removedAtFilter(input.statusFilter === "deleted"),
	};
}

export const buildAssetQueryOrderBy = createQueryOrderByBuilder<
	GetAssetsQueryInput,
	Prisma.AssetOrderByWithRelationInput
>({
	allowedFields: ["createdAt", "originalName", "sizeBytes"],
});
