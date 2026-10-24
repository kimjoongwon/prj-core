import type { ListTenantAccessRequestsForReviewQueryInput } from "@cocrepo/input";

export class ListTenantAccessRequestsForReviewQuery
	implements ListTenantAccessRequestsForReviewQueryInput
{
	readonly reviewerSeq!: ListTenantAccessRequestsForReviewQueryInput["reviewerSeq"];
	readonly spaceSeq?: ListTenantAccessRequestsForReviewQueryInput["spaceSeq"];
	readonly requesterSeq?: ListTenantAccessRequestsForReviewQueryInput["requesterSeq"];
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
