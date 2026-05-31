import type { Prisma } from "@cocrepo/prisma";

export interface ListInquiriesQueryParams {
	where: Prisma.InquiryWhereInput;
	orderBy: Prisma.InquiryOrderByWithRelationInput[];
	skip?: number;
	take?: number;
}
