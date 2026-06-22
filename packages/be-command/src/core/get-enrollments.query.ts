import type { GetEnrollmentsQueryInput } from "@cocrepo/input";

export class GetEnrollmentsQuery implements GetEnrollmentsQueryInput {
	readonly search?: GetEnrollmentsQueryInput["search"];
	readonly courseId?: GetEnrollmentsQueryInput["courseId"];
	readonly courseOfferingId?: GetEnrollmentsQueryInput["courseOfferingId"];
	readonly userId?: GetEnrollmentsQueryInput["userId"];
	readonly timelineId?: GetEnrollmentsQueryInput["timelineId"];
	readonly paymentStatus?: GetEnrollmentsQueryInput["paymentStatus"];
	readonly status?: GetEnrollmentsQueryInput["status"];
	readonly validOn?: GetEnrollmentsQueryInput["validOn"];
	readonly sort?: GetEnrollmentsQueryInput["sort"];
	readonly skip?: GetEnrollmentsQueryInput["skip"];
	readonly take?: GetEnrollmentsQueryInput["take"];

	constructor(input: GetEnrollmentsQueryInput) {
		Object.assign(this, input);
	}
}
