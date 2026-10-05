import type { TenantAccessRequestStatus } from "@cocrepo/prisma";

export interface ListTenantAccessRequestsForReviewQueryInput {
	reviewerId: bigint;
	spaceId?: bigint;
	requesterId?: bigint;
	status?: TenantAccessRequestStatus;
	search?: string;
	createdFrom?: Date;
	createdTo?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
