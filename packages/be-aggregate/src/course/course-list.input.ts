import type { CourseStatus } from "@cocrepo/prisma";

export interface CourseListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	status?: CourseStatus;
	spaceId?: string;
	sort?: string[];
}
