import type { ListInquiriesQueryInput } from "@cocrepo/input";
import type { Prisma } from "@cocrepo/prisma";
import {
	containsFilter,
	dateRangeFilter,
	removedAtFilter,
	toPrismaOrderBy,
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
		...(input.assigneeId ? { assigneeId: input.assigneeId } : {}),
		...(input.customerId ? { customerId: input.customerId } : {}),
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

export function buildInquiryQueryOrderBy(input: ListInquiriesQueryInput) {
	return toPrismaOrderBy(input.sort, {
		allowedFields: [
			"createdAt",
			"updatedAt",
			"priority",
			"status",
			"lastMessageAt",
		],
	}) as Prisma.InquiryOrderByWithRelationInput[];
}
