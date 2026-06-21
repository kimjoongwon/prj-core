import type {
	CourseOfferingStatus,
	TimelineProvisioningMode,
} from "@cocrepo/prisma";

export interface CourseOfferingListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	courseId?: string;
	tenantId?: string;
	timelineId?: string;
	status?: CourseOfferingStatus;
	timelineProvisioningMode?: TimelineProvisioningMode;
	recruitingOnly?: boolean;
	sort?: string[];
}
