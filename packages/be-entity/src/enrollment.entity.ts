import type {
	Enrollment as EnrollmentEntity,
	EnrollmentStatus,
	PaymentStatus,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Course } from "./course.entity";
import type { CourseOffering } from "./course-offering.entity";
import type { CoursePass } from "./course-pass.entity";
import type { Payment } from "./payment.entity";
import type { Timeline } from "./timeline.entity";
import type { User } from "./user.entity";

export class Enrollment extends AbstractEntity implements EnrollmentEntity {
	userId!: string;
	courseId!: string;
	courseOfferingId!: string;
	paymentId!: string | null;
	paymentStatus!: PaymentStatus;
	currency!: string;
	status!: EnrollmentStatus;

	assignedTimelineId!: string | null;
	paymentProvider!: string | null;
	paymentExternalId!: string | null;
	paidAt!: Date | null;
	paidAmount!: number | null;
	validFrom!: Date | null;
	validUntil!: Date | null;

	user?: User;
	course?: Course;
	courseOffering?: CourseOffering;
	payment?: Payment | null;
	assignedTimeline?: Timeline | null;
	coursePass?: CoursePass | null;

	/**
	 * 결제가 완료되었는지 확인합니다.
	 */
	isPaid(): boolean {
		return this.paymentStatus === "PAID";
	}

	/**
	 * 활성 수강 등록인지 확인합니다.
	 */
	isActive(): boolean {
		return this.status === "ACTIVE" && this.removedAt === null;
	}

	/**
	 * 특정 시각에 수강 등록 유효기간 안에 있는지 확인합니다.
	 */
	isValidAt(targetDate: Date = new Date()): boolean {
		if (!this.validFrom || !this.validUntil) return false;
		return targetDate >= this.validFrom && targetDate <= this.validUntil;
	}

	/**
	 * 수강권 발급 가능한 상태인지 확인합니다.
	 */
	canIssueCoursePass(): boolean {
		return this.isPaid() && this.isActive() && !this.coursePass;
	}
}
