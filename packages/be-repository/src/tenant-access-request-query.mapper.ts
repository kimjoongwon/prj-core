import type { ListTenantAccessRequestsForReviewQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	createQueryOrderByBuilder,
	dateRangeFilter,
} from "./query-input.mapper";

export function buildTenantAccessRequestQueryWhere(
	input: ListTenantAccessRequestsForReviewQueryInput,
	baseWhere?: Prisma.TenantAccessRequestWhereInput,
): Prisma.TenantAccessRequestWhereInput {
	const where: Prisma.TenantAccessRequestWhereInput = {
		...(baseWhere ?? {}),
		...(input.spaceId ? { space: { id: input.spaceId } } : {}),
		...(input.requesterId ? { requester: { id: input.requesterId } } : {}),
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
			{
				space: {
					fitnessCenter: {
						is: { company: { is: { name: search } } },
					},
				},
			},
			{
				space: {
					fitnessCenter: {
						is: { company: { is: { label: search } } },
					},
				},
			},
		];
	}

	return where;
}

export const buildTenantAccessRequestQueryOrderBy = createQueryOrderByBuilder<
	ListTenantAccessRequestsForReviewQueryInput,
	Prisma.TenantAccessRequestOrderByWithRelationInput
>({
	allowedFields: ["createdAt", "updatedAt", "status"],
});
