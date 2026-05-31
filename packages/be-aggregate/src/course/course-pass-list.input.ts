import type { CoursePassKind, CoursePassStatus } from "@cocrepo/prisma";

export interface CoursePassListInput {
	skip?: number;
	take?: number;
	search?: string | null;
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
}
