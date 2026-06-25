import type { IdpAccountListInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	createQueryOrderByBuilder,
} from "./query-input.mapper";

export function buildIdpAccountQueryWhere(
	input: IdpAccountListInput,
	baseWhere?: Prisma.UserWhereInput,
): Prisma.UserWhereInput {
	const where: Prisma.UserWhereInput = {
		...(baseWhere ?? {}),
		...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
	};
	const and: Prisma.UserWhereInput[] = [];

	if (input.search) {
		const search = containsFilter(input.search);
		and.push({ OR: [{ name: search }, { email: search }] });
	}

	if (input.isLocked === true) {
		and.push({
			OR: [
				{ isPermanentlyLocked: true },
				{ lockedUntil: { gt: new Date() } },
			],
		});
	}

	if (and.length > 0) {
		const existingAnd =
			where.AND === undefined
				? []
				: Array.isArray(where.AND)
					? where.AND
					: [where.AND];
		where.AND = [...existingAnd, ...and];
	}

	return where;
}

export const buildIdpAccountQueryOrderBy = createQueryOrderByBuilder<
	IdpAccountListInput,
	Prisma.UserOrderByWithRelationInput
>({
	allowedFields: ["createdAt", "name", "email", "lastLoginAt"],
});
