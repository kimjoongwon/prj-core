import type { Prisma } from "@cocrepo/prisma";

export interface ListTenantAccessRequestsForReviewQueryParams {
	reviewerId: string;
	where: Prisma.TenantAccessRequestWhereInput;
	orderBy: Prisma.TenantAccessRequestOrderByWithRelationInput[];
	skip?: number;
	take?: number;
}
