import type { ListInquiriesQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	createQueryOrderByBuilder,
	dateRangeFilter,
	removedAtFilter,
} from "./query-input.mapper";

export function buildInquiryQueryWhere(
	input: ListInquiriesQueryInput,
	baseWhere?: Prisma.InquiryWhereInput,
): Prisma.InquiryWhereInput {
	const where: Prisma.InquiryWhereInput = {
		...(baseWhere ?? {}),
		...(input.category ? { category: input.category } : {}),
		...(input.channel ? { channel: input.channel } : {}),
		...(input.priority ? { priority: input.priority } : {}),
		...(input.inquiryStatus ? { status: input.inquiryStatus } : {}),
		...(input.assigneeId ? { assignee: { id: input.assigneeId } } : {}),
		...(input.customerId ? { customer: { id: input.customerId } } : {}),
	};
	const createdAt = dateRangeFilter(input.startDate, input.endDate);

	if (input.status) {
		where.removedAt = removedAtFilter(input.status === "deleted");
	}

	if (createdAt) {
		where.createdAt = createdAt;
	}

	if (input.search) {
		const search = containsFilter(input.search);
		where.OR = [
			{ title: search },
			{ customer: { name: search } },
			{ customer: { email: search } },
		];
	}

	return where;
}

export const buildInquiryQueryOrderBy = createQueryOrderByBuilder<
	ListInquiriesQueryInput,
	Prisma.InquiryOrderByWithRelationInput
>({
	allowedFields: [
		"createdAt",
		"updatedAt",
		"priority",
		"status",
		"lastMessageAt",
	],
});
