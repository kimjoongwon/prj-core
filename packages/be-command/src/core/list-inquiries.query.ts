import type { ListInquiriesQueryInput } from "@cocrepo/input";

export class ListInquiriesQuery implements ListInquiriesQueryInput {
	readonly search?: ListInquiriesQueryInput["search"];
	readonly status?: ListInquiriesQueryInput["status"];
	readonly category?: ListInquiriesQueryInput["category"];
	readonly channel?: ListInquiriesQueryInput["channel"];
	readonly priority?: ListInquiriesQueryInput["priority"];
	readonly inquiryStatus?: ListInquiriesQueryInput["inquiryStatus"];
	readonly customerId?: ListInquiriesQueryInput["customerId"];
	readonly assigneeId?: ListInquiriesQueryInput["assigneeId"];
	readonly spaceIds?: ListInquiriesQueryInput["spaceIds"];
	readonly startDate?: ListInquiriesQueryInput["startDate"];
	readonly endDate?: ListInquiriesQueryInput["endDate"];
	readonly sort?: ListInquiriesQueryInput["sort"];
	readonly skip?: ListInquiriesQueryInput["skip"];
	readonly take?: ListInquiriesQueryInput["take"];

	constructor(input: ListInquiriesQueryInput) {
		Object.assign(this, input);
	}
}
