import type { EnrollmentStatus, PaymentStatus } from "@cocrepo/prisma";

export interface GetEnrollmentsQueryInput {
	search?: string;
	courseId?: string;
	courseOfferingId?: string;
	userId?: string;
	timelineId?: string;
	paymentStatus?: PaymentStatus;
	status?: EnrollmentStatus;
	validOn?: Date;
	sort?: string[];
	skip?: number;
	take?: number;
}
