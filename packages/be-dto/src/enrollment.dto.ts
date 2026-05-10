import {
	ClassField,
	DateFieldOptional,
	EnumField,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import {
	type Enrollment,
	EnrollmentStatus,
	PaymentStatus,
} from "@cocrepo/prisma";
import { AbstractDto } from "./abstract.dto";
import { CourseDto } from "./course.dto";
import { CourseOfferingDto } from "./course-offering.dto";
import { CoursePassDto } from "./course-pass.dto";
import { PaymentDto } from "./payment.dto";
import { TimelineDto } from "./timeline.dto";
import { UserDto } from "./user.dto";

export class EnrollmentDto extends AbstractDto implements Enrollment {
	@UUIDField({ description: "수강 사용자 ID" })
	userId!: string;

	@UUIDField({ description: "코스 ID" })
	courseId!: string;

	@UUIDField({ description: "코스 개설 ID" })
	courseOfferingId!: string;

	@UUIDFieldOptional({ description: "발급된 수강권 ID", nullable: true })
	coursePassId?: string | null;

	@UUIDFieldOptional({ description: "배정 Timeline ID", nullable: true })
	assignedTimelineId!: string | null;

	@UUIDFieldOptional({ description: "결제 ID", nullable: true })
	paymentId!: string | null;

	@EnumField(() => PaymentStatus, { description: "결제 상태" })
	paymentStatus!: PaymentStatus;

	@StringFieldOptional({
		description: "결제 제공자",
		maxLength: 80,
		nullable: true,
	})
	paymentProvider!: string | null;

	@StringFieldOptional({
		description: "외부 결제 식별자",
		maxLength: 160,
		nullable: true,
	})
	paymentExternalId!: string | null;

	@DateFieldOptional({ description: "결제 완료 시각", nullable: true })
	paidAt!: Date | null;

	@NumberFieldOptional({
		description: "결제 금액",
		int: true,
		min: 0,
		nullable: true,
	})
	paidAmount!: number | null;

	@StringField({
		description: "결제 통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
	})
	currency!: string;

	@DateFieldOptional({ description: "수강 유효 시작일", nullable: true })
	validFrom!: Date | null;

	@DateFieldOptional({ description: "수강 유효 종료일", nullable: true })
	validUntil!: Date | null;

	@EnumField(() => EnrollmentStatus, { description: "수강 등록 상태" })
	status!: EnrollmentStatus;

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

	@ClassField(() => PaymentDto, {
		description: "결제 정보",
		required: false,
	})
	payment?: PaymentDto;

	@ClassField(() => TimelineDto, {
		description: "배정 Timeline",
		required: false,
	})
	assignedTimeline?: TimelineDto;

	@ClassField(() => CoursePassDto, {
		description: "발급된 수강권",
		required: false,
	})
	coursePass?: CoursePassDto;
}
