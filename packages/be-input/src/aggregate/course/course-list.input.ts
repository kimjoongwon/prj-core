import type { CourseStatus } from "@cocrepo/prisma";

export interface CourseListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	status?: CourseStatus;
	tenantId?: string;
	sort?: string[];
}
