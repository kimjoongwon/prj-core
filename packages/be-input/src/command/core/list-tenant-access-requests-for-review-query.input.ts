import type { TenantAccessRequestStatus } from "@cocrepo/prisma";

export interface ListTenantAccessRequestsForReviewQueryInput {
	reviewerSeq: bigint;
	spaceSeq?: bigint;
	requesterSeq?: bigint;
	status?: TenantAccessRequestStatus;
	search?: string;
	createdFrom?: Date;
	createdTo?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
