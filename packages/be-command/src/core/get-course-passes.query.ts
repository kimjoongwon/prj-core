import type { GetCoursePassesQueryInput } from "@cocrepo/input";

export class GetCoursePassesQuery implements GetCoursePassesQueryInput {
	readonly search?: GetCoursePassesQueryInput["search"];
	readonly courseId?: GetCoursePassesQueryInput["courseId"];
	readonly courseOfferingId?: GetCoursePassesQueryInput["courseOfferingId"];
	readonly enrollmentId?: GetCoursePassesQueryInput["enrollmentId"];
	readonly userId?: GetCoursePassesQueryInput["userId"];
	readonly timelineId?: GetCoursePassesQueryInput["timelineId"];
	readonly status?: GetCoursePassesQueryInput["status"];
	readonly kind?: GetCoursePassesQueryInput["kind"];
	readonly validOn?: GetCoursePassesQueryInput["validOn"];
	readonly expiresBefore?: GetCoursePassesQueryInput["expiresBefore"];
	readonly sort?: GetCoursePassesQueryInput["sort"];
	readonly skip?: GetCoursePassesQueryInput["skip"];
	readonly take?: GetCoursePassesQueryInput["take"];

	constructor(input: GetCoursePassesQueryInput) {
		Object.assign(this, input);
	}
}
