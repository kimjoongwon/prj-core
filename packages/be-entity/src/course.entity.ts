import type { Course as CourseEntity, CourseStatus } from "@cocrepo/prisma";
import { AbstractEntity } from "./abstract.entity";
import type { CourseOffering } from "./course-offering.entity";
import type { CoursePass } from "./course-pass.entity";
import type { Enrollment } from "./enrollment.entity";
import type { Space } from "./space.entity";

export class Course extends AbstractEntity implements CourseEntity {
	spaceId!: string;
	name!: string;
	durationMonths!: number;
	basePriceAmount!: number;
	currency!: string;
	status!: CourseStatus;
	activeOfferingCount!: number;
	activeEnrollmentCount!: number;

	description!: string | null;

	space?: Space;
	offerings?: CourseOffering[];
	enrollments?: Enrollment[];
	passes?: CoursePass[];

	/**
	 * 운영 가능한 활성 코스인지 확인합니다.
	 */
	isActive(): boolean {
		return this.status === "ACTIVE" && this.removedAt === null;
	}

	/**
	 * 초안 상태인지 확인합니다.
	 */
	isDraft(): boolean {
		return this.status === "DRAFT";
	}

	/**
	 * 보관 상태인지 확인합니다.
	 */
	isArchived(): boolean {
		return this.status === "ARCHIVED";
	}

	/**
	 * 활성 개설 반이 있는지 확인합니다.
	 */
	hasActiveOfferings(): boolean {
		return this.activeOfferingCount > 0;
	}

	/**
	 * 활성 수강 등록이 있는지 확인합니다.
	 */
	hasActiveEnrollments(): boolean {
		return this.activeEnrollmentCount > 0;
	}
}
