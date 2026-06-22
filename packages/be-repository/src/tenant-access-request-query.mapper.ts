import type { ListTenantAccessRequestsForReviewQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	dateRangeFilter,
	toPrismaOrderBy,
} from "./query-input.mapper";

export function buildTenantAccessRequestQueryWhere(
	input: ListTenantAccessRequestsForReviewQueryInput,
	baseWhere?: Prisma.TenantAccessRequestWhereInput,
): Prisma.TenantAccessRequestWhereInput {
	const where: Prisma.TenantAccessRequestWhereInput = {
		...(baseWhere ?? {}),
		...(input.spaceId ? { spaceId: input.spaceId } : {}),
		...(input.requesterId ? { requesterId: input.requesterId } : {}),
		...(input.status ? { status: input.status } : {}),
	};
	const createdAt = dateRangeFilter(input.createdFrom, input.createdTo);

	if (createdAt) {
		where.createdAt = createdAt;
	}

	if (input.search) {
		const search = containsFilter(input.search);
		where.OR = [
			{ requester: { name: search } },
			{ requester: { email: search } },
			{ space: { company: { is: { name: search } } } },
			{ space: { company: { is: { label: search } } } },
		];
	}

	return where;
}

export function buildTenantAccessRequestQueryOrderBy(
	input: ListTenantAccessRequestsForReviewQueryInput,
) {
	return toPrismaOrderBy(input.sort, {
		allowedFields: ["createdAt", "updatedAt", "status"],
	}) as Prisma.TenantAccessRequestOrderByWithRelationInput[];
}
