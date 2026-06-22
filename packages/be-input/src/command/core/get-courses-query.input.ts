import type { CourseStatus } from "@cocrepo/prisma";

export interface GetCoursesQueryInput {
	search?: string;
	status?: CourseStatus;
	tenantId?: string;
	sort?: string[];
	skip?: number;
	take?: number;
}
