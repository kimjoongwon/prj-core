import type {
	CourseOffering as CourseOfferingEntity,
	CourseOfferingStatus,
	TimelineProvisioningMode,
} from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { Course } from "./course.entity";
import type { CoursePass } from "./course-pass.entity";
import type { Enrollment } from "./enrollment.entity";
import type { Space } from "./space.entity";
import type { Timeline } from "./timeline.entity";

export class CourseOffering
	extends AbstractEntity
	implements CourseOfferingEntity
{
	courseId!: string;
	spaceId!: string;
	timelineProvisioningMode!: TimelineProvisioningMode;
	name!: string;
	startsAt!: Date;
	endsAt!: Date;
	capacity!: number;
	enrolledCount!: number;
	status!: CourseOfferingStatus;

	timelineId!: string | null;
	enrollmentStartsAt!: Date | null;
	enrollmentEndsAt!: Date | null;

	course?: Course;
	space?: Space;
	timeline?: Timeline | null;
	enrollments?: Enrollment[];
	passes?: CoursePass[];

	/**
	 * 모집 중인지 확인합니다.
	 */
	isEnrolling(): boolean {
		return this.status === "ENROLLING";
	}

	/**
	 * 운영 중인 개설 반인지 확인합니다.
	 */
	isActive(): boolean {
		return this.status === "ACTIVE" && this.removedAt === null;
	}

	/**
	 * 정원이 모두 찼는지 확인합니다.
	 */
	isFull(): boolean {
		return this.enrolledCount >= this.capacity;
	}

	/**
	 * 추가 등록 가능한 인원을 반환합니다.
	 */
	getRemainingCapacity(): number {
		return Math.max(this.capacity - this.enrolledCount, 0);
	}

	/**
	 * 특정 시각이 모집 기간 안에 있는지 확인합니다.
	 */
	isEnrollmentOpenAt(targetDate: Date = new Date()): boolean {
		if (!this.enrollmentStartsAt || !this.enrollmentEndsAt) {
			return this.isEnrolling();
		}

		return (
			this.isEnrolling() &&
			targetDate >= this.enrollmentStartsAt &&
			targetDate <= this.enrollmentEndsAt
		);
	}
}
