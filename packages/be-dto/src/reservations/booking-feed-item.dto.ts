import {
	DateField,
	EnumField,
	EnumFieldOptional,
	NumberField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";
import { ReservationStatus } from "@cocrepo/prisma";

import { ReservationAvailabilityStatus } from "./reservation-availability-status";

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
