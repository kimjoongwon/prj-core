import type { GetCoursesQueryInput } from "@cocrepo/input";

export class GetCoursesQuery implements GetCoursesQueryInput {
	readonly search?: GetCoursesQueryInput["search"];
	readonly status?: GetCoursesQueryInput["status"];
	readonly tenantId?: GetCoursesQueryInput["tenantId"];
	readonly sort?: GetCoursesQueryInput["sort"];
	readonly skip?: GetCoursesQueryInput["skip"];
	readonly take?: GetCoursesQueryInput["take"];

	constructor(input: GetCoursesQueryInput) {
		Object.assign(this, input);
	}
}
