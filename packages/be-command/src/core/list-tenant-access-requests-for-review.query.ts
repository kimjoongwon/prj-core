import type { ListTenantAccessRequestsForReviewQueryInput } from "@cocrepo/input";

export class ListTenantAccessRequestsForReviewQuery
	implements ListTenantAccessRequestsForReviewQueryInput
{
	readonly reviewerId!: ListTenantAccessRequestsForReviewQueryInput["reviewerId"];
	readonly spaceId?: ListTenantAccessRequestsForReviewQueryInput["spaceId"];
	readonly requesterId?: ListTenantAccessRequestsForReviewQueryInput["requesterId"];
	readonly status?: ListTenantAccessRequestsForReviewQueryInput["status"];
	readonly search?: ListTenantAccessRequestsForReviewQueryInput["search"];
	readonly createdFrom?: ListTenantAccessRequestsForReviewQueryInput["createdFrom"];
	readonly createdTo?: ListTenantAccessRequestsForReviewQueryInput["createdTo"];
	readonly sort?: ListTenantAccessRequestsForReviewQueryInput["sort"];
	readonly skip?: ListTenantAccessRequestsForReviewQueryInput["skip"];
	readonly take?: ListTenantAccessRequestsForReviewQueryInput["take"];

	constructor(input: ListTenantAccessRequestsForReviewQueryInput) {
		Object.assign(this, input);
	}
}
