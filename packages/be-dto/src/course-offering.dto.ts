import {
	ClassField,
	DateField,
	DateFieldOptional,
	EnumField,
	NumberField,
	StringField,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import {
	type CourseOffering,
	CourseOfferingStatus,
	TimelineProvisioningMode,
} from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { CourseDto } from "./course.dto";
import { CoursePassDto } from "./course-pass.dto";
import { EnrollmentDto } from "./enrollment.dto";
import { TenantDto } from "./tenant.dto";
import { TimelineDto } from "./timeline.dto";

export class CourseOfferingDto extends AbstractDto implements CourseOffering {
	@UUIDField({ description: "코스 ID" })
	courseId!: string;

	@UUIDField({ description: "소속 Tenant ID" })
	tenantId!: string;

	@UUIDFieldOptional({ description: "연결 Timeline ID", nullable: true })
	timelineId!: string | null;

	@EnumField(() => TimelineProvisioningMode, {
		description: "타임라인 준비 방식",
	})
	timelineProvisioningMode!: TimelineProvisioningMode;

	@StringField({ description: "개설명", minLength: 1, maxLength: 120 })
	name!: string;

	@DateField({ description: "개설 시작일" })
	startsAt!: Date;

	@DateField({ description: "개설 종료일" })
	endsAt!: Date;

	@DateFieldOptional({ description: "모집 시작일", nullable: true })
	enrollmentStartsAt!: Date | null;

	@DateFieldOptional({ description: "모집 종료일", nullable: true })
	enrollmentEndsAt!: Date | null;

	@NumberField({ description: "정원", int: true, min: 1 })
	capacity!: number;

	@NumberField({ description: "등록 인원 수", int: true, min: 0 })
	enrolledCount!: number;

	@EnumField(() => CourseOfferingStatus, { description: "개설 상태" })
	status!: CourseOfferingStatus;

	@ClassField(() => CourseDto, {
		description: "코스 정보",
		required: false,
	})
	course?: CourseDto;

	@ClassField(() => TenantDto, {
		description: "소속 Tenant",
		required: false,
	})
	tenant?: TenantDto;

	@ClassField(() => TimelineDto, {
		description: "연결 Timeline",
		required: false,
	})
	timeline?: TimelineDto;

	@ClassField(() => EnrollmentDto, {
		description: "수강 등록 목록",
		each: true,
		isArray: true,
		required: false,
	})
	enrollments?: EnrollmentDto[];

	@ClassField(() => CoursePassDto, {
		description: "수강권 목록",
		each: true,
		isArray: true,
		required: false,
	})
	passes?: CoursePassDto[];
}
