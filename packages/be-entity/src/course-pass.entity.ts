import type {
	CoursePass as CoursePassEntity,
	CoursePassKind,
	CoursePassStatus,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Course } from "./course.entity";
import type { CourseOffering } from "./course-offering.entity";
import type { Enrollment } from "./enrollment.entity";
import type { Reservation } from "./reservation.entity";
import type { Timeline } from "./timeline.entity";
import type { User } from "./user.entity";

export class CoursePass extends AbstractEntity implements CoursePassEntity {
	enrollmentId!: string;
	userId!: string;
	courseId!: string;
	courseOfferingId!: string;
	timelineId!: string;
	kind!: CoursePassKind;
	issuedAt!: Date;
	validFrom!: Date;
	expiresAt!: Date;
	reservationLimit!: number;
	reservationUsedCount!: number;
	reservationRemainingCount!: number;
	status!: CoursePassStatus;

	enrollment?: Enrollment;
	user?: User;
	course?: Course;
	courseOffering?: CourseOffering;
	timeline?: Timeline;
	reservations?: Reservation[];

	/**
	 * 활성 수강권인지 확인합니다.
	 */
	isActive(): boolean {
		return this.status === "ACTIVE" && this.removedAt === null;
	}

	/**
	 * 특정 시각 기준으로 유효한 수강권인지 확인합니다.
	 */
	isValidAt(targetDate: Date = new Date()): boolean {
		return (
			this.isActive() &&
			targetDate >= this.validFrom &&
			targetDate <= this.expiresAt
		);
	}

	/**
	 * 남은 예약권이 있는지 확인합니다.
	 */
	hasReservationRemaining(): boolean {
		return this.reservationRemainingCount > 0;
	}

	/**
	 * 예약권을 추가로 사용할 수 있는지 확인합니다.
	 */
	canReserveAt(targetDate: Date = new Date()): boolean {
		return this.isValidAt(targetDate) && this.hasReservationRemaining();
	}
}
