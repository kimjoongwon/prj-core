import type { GetOidcClientsQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import { containsFilter, toPrismaOrderBy } from "./query-input.mapper";

export function buildOidcClientQueryWhere(
	input: GetOidcClientsQueryInput,
	baseWhere?: Prisma.OidcClientWhereInput,
): Prisma.OidcClientWhereInput {
	const where: Prisma.OidcClientWhereInput = {
		...(baseWhere ?? {}),
		...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
	};

	if (input.search) {
		const search = containsFilter(input.search);
		where.OR = [{ clientId: search }, { name: search }];
	}

	return where;
}

export function buildOidcClientQueryOrderBy(input: GetOidcClientsQueryInput) {
	return toPrismaOrderBy(input.sort) as Prisma.OidcClientOrderByWithRelationInput[];
}
