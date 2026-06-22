import type { CoursePassKind, CoursePassStatus } from "@cocrepo/prisma";

export interface GetCoursePassesQueryInput {
	search?: string;
	courseId?: string;
	courseOfferingId?: string;
	enrollmentId?: string;
	userId?: string;
	timelineId?: string;
	status?: CoursePassStatus;
	kind?: CoursePassKind;
	validOn?: Date;
	expiresBefore?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
