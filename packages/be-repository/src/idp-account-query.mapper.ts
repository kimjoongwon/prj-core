import type { GetIdpAccountsQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import { containsFilter, toPrismaOrderBy } from "./query-input.mapper";

export function buildIdpAccountQueryWhere(
	input: GetIdpAccountsQueryInput,
	baseWhere?: Prisma.UserWhereInput,
): Prisma.UserWhereInput {
	const where: Prisma.UserWhereInput = {
		...(baseWhere ?? {}),
		...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
	};

	if (input.search) {
		const search = containsFilter(input.search);
		where.OR = [{ name: search }, { email: search }];
	}

	if (input.isLocked === true) {
		where.OR = [
			{ isPermanentlyLocked: true },
			{ lockedUntil: { gt: new Date() } },
		];
	}

	return where;
}

export function buildIdpAccountQueryOrderBy(input: GetIdpAccountsQueryInput) {
	return toPrismaOrderBy(input.sort) as Prisma.UserOrderByWithRelationInput[];
}
