import {
	DateField,
	StringField,
	StringFieldOptional,
	UUIDField,
} from "@cocrepo/decorator";

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
