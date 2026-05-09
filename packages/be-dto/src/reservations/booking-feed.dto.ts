import {
	DateField,
	DateFieldOptional,
	EnumField,
	EnumFieldOptional,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
	UUIDFieldOptional,
} from "@cocrepo/decorator";
import { ReservationStatus } from "@cocrepo/prisma";
import { QueryDto } from "../query/query.dto";

export enum ReservationAvailabilityStatus {
	AVAILABLE = "AVAILABLE",
	FEW_LEFT = "FEW_LEFT",
	WAITLIST_OPEN = "WAITLIST_OPEN",
	RESERVED = "RESERVED",
	WAITLISTED = "WAITLISTED",
	BOOKING_CLOSED = "BOOKING_CLOSED",
}

export class QueryBookingFeedDto extends QueryDto {
	@DateFieldOptional({ description: "조회 시작 일시" })
	dateFrom?: Date;

	@DateFieldOptional({ description: "조회 종료 일시" })
	dateTo?: Date;

	@StringFieldOptional({
		description: "클라이언트 표시 타임존",
		default: "Asia/Seoul",
	})
	timeZone?: string;

	@UUIDFieldOptional({ description: "타임라인 ID 필터" })
	timelineId?: string;

	@UUIDFieldOptional({ description: "프로그램 ID 필터" })
	programId?: string;

	@StringFieldOptional({ description: "프로그램/세션/타임라인 검색어" })
	search?: string;
}

export class QueryMyReservationsDto extends QueryDto {
	@DateFieldOptional({ description: "조회 시작 시각" })
	from?: Date;

	@DateFieldOptional({ description: "조회 종료 시각" })
	to?: Date;

	@EnumFieldOptional(() => ReservationStatus, { description: "예약 상태" })
	status?: ReservationStatus;
}

export class BookingFeedItemDto {
	@StringField({ description: "피드 항목 ID" })
	feedItemId!: string;

	@StringField({ description: "일자(YYYY-MM-DD)" })
	date!: string;

	@DateField({ description: "시작 시각" })
	startsAt!: Date;

	@DateField({ description: "종료 시각" })
	endsAt!: Date;

	@UUIDField({ description: "타임라인 ID" })
	timelineId!: string;

	@UUIDField({ description: "세션 ID" })
	sessionId!: string;

	@UUIDField({ description: "프로그램 ID" })
	programId!: string;

	@UUIDFieldOptional({
		description: "예약 생성에 사용할 수강권 ID",
		nullable: true,
	})
	coursePassId!: string | null;

	@StringField({ description: "타임라인 이름" })
	timelineName!: string;

	@StringField({ description: "세션 이름" })
	sessionName!: string;

	@StringField({ description: "프로그램 이름" })
	programName!: string;

	@StringFieldOptional({ description: "코치 이름", nullable: true })
	coachName!: string | null;

	@NumberField({ description: "정원", int: true, minimum: 0 })
	capacity!: number;

	@NumberField({ description: "확정 예약 수", int: true, minimum: 0 })
	confirmedCount!: number;

	@NumberField({ description: "예약 가능 좌석 수", int: true, minimum: 0 })
	availableSeatCount!: number;

	@NumberField({ description: "대기 예약 수", int: true, minimum: 0 })
	waitlistCount!: number;

	@EnumField(() => ReservationAvailabilityStatus, {
		description: "예약 가능 상태",
	})
	availabilityStatus!: ReservationAvailabilityStatus;

	@EnumFieldOptional(() => ReservationStatus, {
		description: "내 예약 상태",
		nullable: true,
	})
	myReservationStatus!: ReservationStatus | null;

	@StringField({ description: "CTA 라벨" })
	ctaLabel!: string;

	@DateField({ description: "취소 가능 마감 시각", nullable: true })
	cancelableUntilAt!: Date | null;

	@StringFieldOptional({ description: "난이도", nullable: true })
	level!: string | null;

	@StringFieldOptional({ description: "루틴 라벨 스냅샷", nullable: true })
	routineLabelSnapshot!: string | null;

	@StringFieldOptional({ description: "운동 미리보기", each: true })
	previewExerciseNames!: string[];
}
