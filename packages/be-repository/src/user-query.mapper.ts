import type { GetUsersInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	dateRangeFilter,
	removedAtFilter,
	toPrismaOrderBy,
} from "./query-input.mapper";

export function buildUserQueryWhere(
	input: GetUsersInput,
	baseWhere?: Prisma.UserWhereInput,
): Prisma.UserWhereInput {
	const where: Prisma.UserWhereInput = { ...(baseWhere ?? {}) };

	if (input.name) {
		where.name = containsFilter(input.name);
	}

	if (input.email) {
		where.email = containsFilter(input.email);
	}

	if (input.phone) {
		where.phone = containsFilter(input.phone);
	}

	const createdAt = dateRangeFilter(input.createdFrom, input.createdTo);
	if (createdAt) {
		where.createdAt = createdAt;
	}

	where.removedAt = removedAtFilter(input.status === "deleted");

	if (input.nickname) {
		where.profiles = {
			some: { nickname: containsFilter(input.nickname) },
		};
	}

	const roles = input.roles ?? (input.role ? [input.role] : undefined);
	if (roles?.length) {
		const existing =
			(baseWhere?.tenants as Record<string, unknown> | undefined)?.some ?? {};
		where.tenants = {
			some: {
				...(existing as Record<string, unknown>),
				role: { name: { in: roles } },
			},
		};
	}

	if (input.categoryId) {
		where.classification = { categoryId: input.categoryId };
	}

	if (input.groupIds?.length) {
		where.associations = {
			some: { groupId: { in: input.groupIds }, removedAt: null },
		};
	}

	return where;
}

export function buildUserQueryOrderBy(input: GetUsersInput) {
	return toPrismaOrderBy(input.sort, {
		allowedFields: ["createdAt", "name", "email"],
	}) as Prisma.UserOrderByWithRelationInput[];
}
