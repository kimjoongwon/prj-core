import type { GetCourseOfferingsQueryInput } from "@cocrepo/input";

export class GetCourseOfferingsQuery implements GetCourseOfferingsQueryInput {
	readonly search?: GetCourseOfferingsQueryInput["search"];
	readonly courseId?: GetCourseOfferingsQueryInput["courseId"];
	readonly tenantId?: GetCourseOfferingsQueryInput["tenantId"];
	readonly timelineId?: GetCourseOfferingsQueryInput["timelineId"];
	readonly status?: GetCourseOfferingsQueryInput["status"];
	readonly timelineProvisioningMode?: GetCourseOfferingsQueryInput["timelineProvisioningMode"];
	readonly recruitingOnly?: GetCourseOfferingsQueryInput["recruitingOnly"];
	readonly sort?: GetCourseOfferingsQueryInput["sort"];
	readonly skip?: GetCourseOfferingsQueryInput["skip"];
	readonly take?: GetCourseOfferingsQueryInput["take"];

	constructor(input: GetCourseOfferingsQueryInput) {
		Object.assign(this, input);
	}
}
