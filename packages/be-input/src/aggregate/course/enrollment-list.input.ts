import type { EnrollmentStatus, PaymentStatus } from "@cocrepo/prisma";

export interface EnrollmentListInput {
	skip?: number;
	take?: number;
	search?: string | null;
	courseId?: string;
	courseOfferingId?: string;
	userId?: string;
	timelineId?: string;
	paymentId?: string;
	paymentStatus?: PaymentStatus;
	status?: EnrollmentStatus;
	validOn?: Date;
	sort?: string[];
}
