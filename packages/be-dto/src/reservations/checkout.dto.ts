import {
	ClassField,
	DateField,
	EnumField,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { PaymentMethod, PaymentStatus } from "@cocrepo/prisma";
import { CoursePassDto } from "../course-pass.dto";
import { EnrollmentDto } from "../enrollment.dto";
import { PaymentDto } from "../payment.dto";
import { ReservationDto } from "./reservation.dto";

export enum ReservationCheckoutProgressStatus {
	COMPLETED = "COMPLETED",
	CURRENT = "CURRENT",
	PENDING = "PENDING",
}

export class ReservationCheckoutContextDto {
	@StringField({ description: "피드 항목 ID" })
	feedItemId!: string;

	@UUIDField({ description: "타임라인 ID" })
	timelineId!: string;

	@UUIDField({ description: "세션 ID" })
	sessionId!: string;

	@UUIDField({ description: "프로그램 ID" })
	programId!: string;

	@DateField({ description: "예약 회차 시작 시각" })
	occurrenceStartAt!: Date;

	@DateField({ description: "예약 회차 종료 시각" })
	occurrenceEndsAt!: Date;

	@StringField({ description: "타임라인 이름" })
	timelineName!: string;

	@StringField({ description: "세션 이름" })
	sessionName!: string;

	@StringField({ description: "프로그램 이름" })
	programName!: string;

	@StringFieldOptional({ description: "코치 이름", nullable: true })
	coachName!: string | null;
}

export class ReservationCheckoutOptionDto {
	@UUIDField({ description: "코스 ID" })
	courseId!: string;

	@UUIDField({ description: "코스 개설 ID" })
	courseOfferingId!: string;

	@UUIDField({ description: "사용할 Timeline ID" })
	timelineId!: string;

	@StringField({ description: "코스명" })
	courseName!: string;

	@StringField({ description: "개설명" })
	courseOfferingName!: string;

	@NumberField({ description: "수강 기간(개월)", int: true, min: 1 })
	durationMonths!: number;

	@NumberField({ description: "결제 금액", int: true, min: 0 })
	priceAmount!: number;

	@StringField({
		description: "통화 코드",
		minLength: 3,
		maxLength: 3,
		toUpperCase: true,
	})
	currency!: string;

	@NumberField({ description: "예상 예약 가능 횟수", int: true, min: 0 })
	reservationLimit!: number;
}

export class ReservationCheckoutBootstrapDto {
	@ClassField(() => ReservationCheckoutContextDto, {
		description: "예약하려는 수업 컨텍스트",
	})
	context!: ReservationCheckoutContextDto;

	@ClassField(() => ReservationCheckoutOptionDto, {
		description: "구매 가능한 과정 목록",
		each: true,
		isArray: true,
	})
	options!: ReservationCheckoutOptionDto[];

	@EnumField(() => PaymentMethod, {
		description: "지원 결제 수단 목록",
		each: true,
	})
	paymentMethods!: PaymentMethod[];
}

export class QueryReservationCheckoutBootstrapDto {
	@UUIDField({ description: "타임라인 ID" })
	timelineId!: string;

	@UUIDField({ description: "세션 ID" })
	sessionId!: string;

	@UUIDField({ description: "프로그램 ID" })
	programId!: string;

	@DateField({ description: "예약 회차 시작 시각" })
	occurrenceStartAt!: Date;
}

export class ReservationCheckoutProgressStepDto {
	@StringField({ description: "단계 ID" })
	id!: string;

	@StringField({ description: "단계 라벨" })
	label!: string;

	@EnumField(() => ReservationCheckoutProgressStatus, {
		description: "단계 상태",
	})
	status!: ReservationCheckoutProgressStatus;
}

export class CreateReservationCheckoutDto {
	@UUIDField({ description: "구매할 코스 개설 ID" })
	courseOfferingId!: string;

	@UUIDField({ description: "타임라인 ID" })
	timelineId!: string;

	@UUIDField({ description: "세션 ID" })
	sessionId!: string;

	@UUIDField({ description: "프로그램 ID" })
	programId!: string;

	@DateField({ description: "예약 회차 시작 시각" })
	occurrenceStartAt!: Date;

	@StringField({
		description: "checkout/예약 멱등성 키",
		minLength: 8,
		maxLength: 120,
	})
	idempotencyKey!: string;

	@EnumField(() => PaymentMethod, { description: "placeholder 결제 수단" })
	paymentMethod!: PaymentMethod;

	@StringFieldOptional({
		description: "예약 메모",
		maxLength: 1000,
		nullable: true,
	})
	memo?: string | null;
}

export class ReservationCheckoutResultDto {
	@EnumField(() => PaymentStatus, { description: "checkout 결제 상태" })
	status!: PaymentStatus;

	@ClassField(() => PaymentDto, { description: "생성된 결제 원장" })
	payment!: PaymentDto;

	@ClassField(() => EnrollmentDto, { description: "활성화된 수강 등록" })
	enrollment!: EnrollmentDto;

	@ClassField(() => CoursePassDto, { description: "발급된 수강권" })
	coursePass!: CoursePassDto;

	@ClassField(() => ReservationDto, { description: "확정 또는 대기 예약" })
	reservation!: ReservationDto;

	@ClassField(() => ReservationCheckoutProgressStepDto, {
		description: "모바일 checkout 진행 상태",
		each: true,
		isArray: true,
	})
	progressSteps!: ReservationCheckoutProgressStepDto[];
}
