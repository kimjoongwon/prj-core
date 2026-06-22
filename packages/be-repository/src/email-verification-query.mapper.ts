import type { GetEmailVerificationsQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	dateRangeFilter,
	toPrismaOrderBy,
} from "./query-input.mapper";

export function buildEmailVerificationQueryWhere(
	input: GetEmailVerificationsQueryInput,
	baseWhere?: Prisma.EmailVerificationWhereInput,
): Prisma.EmailVerificationWhereInput {
	const where: Prisma.EmailVerificationWhereInput = {
		...(baseWhere ?? {}),
		...(input.email ? { email: containsFilter(input.email) } : {}),
		...(input.status ? { status: input.status } : {}),
	};
	const createdAt = dateRangeFilter(input.startDate, input.endDate);

	if (createdAt) {
		where.createdAt = createdAt;
	}

	return where;
}

export function buildEmailVerificationQueryOrderBy(
	input: GetEmailVerificationsQueryInput,
) {
	return toPrismaOrderBy(input.sort) as Prisma.EmailVerificationOrderByWithRelationInput[];
}
