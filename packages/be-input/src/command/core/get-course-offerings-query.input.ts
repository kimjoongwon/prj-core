import type {
	CourseOfferingStatus,
	TimelineProvisioningMode,
} from "@cocrepo/prisma";

export interface GetCourseOfferingsQueryInput {
	search?: string;
	courseId?: string;
	tenantId?: string;
	timelineId?: string;
	status?: CourseOfferingStatus;
	timelineProvisioningMode?: TimelineProvisioningMode;
	recruitingOnly?: boolean;
	sort?: string[];
	skip?: number;
	take?: number;
}
