import type { EnrollmentStatus, PaymentStatus } from "@cocrepo/prisma";

export interface CreateEnrollmentInput {
	courseId: string;
	courseOfferingId: string;
	userId: string;
	paymentId?: string | null;
	paymentProvider?: string | null;
	paymentExternalId?: string | null;
	paymentStatus?: PaymentStatus;
	paidAmount?: number | null;
	currency?: string | null;
	assignedTimelineId?: string | null;
	status?: EnrollmentStatus;
	enrolledAt?: Date;
	paidAt?: Date | null;
	validFrom?: Date | null;
	validUntil?: Date | null;
	canceledAt?: Date | null;
	completedAt?: Date | null;
}
