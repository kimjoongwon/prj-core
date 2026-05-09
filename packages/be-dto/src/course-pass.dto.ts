import {
	ClassField,
	DateField,
	EnumField,
	NumberField,
	UUIDField,
} from "@cocrepo/decorator";
import {
	CoursePassKind,
	type CoursePass,
	CoursePassStatus,
} from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { CourseDto } from "./course.dto";
import { CourseOfferingDto } from "./course-offering.dto";
import { EnrollmentDto } from "./enrollment.dto";
import { ReservationDto } from "./reservations/reservation.dto";
import { TimelineDto } from "./timeline.dto";
import { UserDto } from "./user.dto";

export class CoursePassDto extends AbstractDto implements CoursePass {
	@UUIDField({ description: "수강 등록 ID" })
	enrollmentId!: string;

	@UUIDField({ description: "수강 사용자 ID" })
	userId!: string;

	@UUIDField({ description: "코스 ID" })
	courseId!: string;

	@UUIDField({ description: "코스 개설 ID" })
	courseOfferingId!: string;

	@UUIDField({ description: "사용 가능한 Timeline ID" })
	timelineId!: string;

	@EnumField(() => CoursePassKind, { description: "수강권 종류" })
	kind!: CoursePassKind;

	@DateField({ description: "수강권 발급 시각" })
	issuedAt!: Date;

	@DateField({ description: "수강권 유효 시작일" })
	validFrom!: Date;

	@DateField({ description: "수강권 만료일" })
	expiresAt!: Date;

	@NumberField({ description: "예약 가능 횟수", int: true, min: 0 })
	reservationLimit!: number;

	@NumberField({ description: "사용한 예약 횟수", int: true, min: 0 })
	reservationUsedCount!: number;

	@NumberField({ description: "남은 예약 횟수", int: true, min: 0 })
	reservationRemainingCount!: number;

	@EnumField(() => CoursePassStatus, { description: "수강권 상태" })
	status!: CoursePassStatus;

	@ClassField(() => EnrollmentDto, {
		description: "수강 등록 정보",
		required: false,
	})
	enrollment?: EnrollmentDto;

	@ClassField(() => UserDto, {
		description: "수강 사용자",
		required: false,
	})
	user?: UserDto;

	@ClassField(() => CourseDto, {
		description: "코스 정보",
		required: false,
	})
	course?: CourseDto;

	@ClassField(() => CourseOfferingDto, {
		description: "코스 개설 정보",
		required: false,
	})
	courseOffering?: CourseOfferingDto;

	@ClassField(() => TimelineDto, {
		description: "사용 가능한 Timeline",
		required: false,
	})
	timeline?: TimelineDto;

	@ClassField(() => ReservationDto, {
		description: "수강권을 사용한 예약 목록",
		each: true,
		isArray: true,
		required: false,
	})
	reservations?: ReservationDto[];
}
