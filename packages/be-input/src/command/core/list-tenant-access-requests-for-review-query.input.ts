import type { TenantAccessRequestStatus } from "@cocrepo/prisma";

export interface ListTenantAccessRequestsForReviewQueryInput {
	reviewerId: string;
	spaceId?: string;
	requesterId?: string;
	status?: TenantAccessRequestStatus;
	search?: string;
	createdFrom?: Date;
	createdTo?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
