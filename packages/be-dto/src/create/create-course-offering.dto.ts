import {
	DateField,
	DateFieldOptional,
	EnumFieldOptional,
	NumberField,
	StringField,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import {
	CourseOfferingStatus,
	TimelineProvisioningMode,
} from "@cocrepo/prisma";

export class CreateCourseOfferingDto {
	@UUIDField({ description: "코스 ID" })
	courseId!: string;

	@UUIDField({ description: "소속 Space ID" })
	spaceId!: string;

	@UUIDFieldOptional({ description: "연결 Timeline ID", nullable: true })
	timelineId?: string | null;

	@EnumFieldOptional(() => TimelineProvisioningMode, {
		description: "타임라인 준비 방식",
		default: TimelineProvisioningMode.SHARED,
	})
	timelineProvisioningMode?: TimelineProvisioningMode;

	@StringField({ description: "개설명", minLength: 1, maxLength: 120 })
	name!: string;

	@DateField({ description: "개설 시작일" })
	startsAt!: Date;

	@DateField({ description: "개설 종료일" })
	endsAt!: Date;

	@DateFieldOptional({ description: "모집 시작일", nullable: true })
	enrollmentStartsAt?: Date | null;

	@DateFieldOptional({ description: "모집 종료일", nullable: true })
	enrollmentEndsAt?: Date | null;

	@NumberField({ description: "정원", int: true, min: 1 })
	capacity!: number;

	@EnumFieldOptional(() => CourseOfferingStatus, {
		description: "개설 상태",
		default: CourseOfferingStatus.DRAFT,
	})
	status?: CourseOfferingStatus;
}
