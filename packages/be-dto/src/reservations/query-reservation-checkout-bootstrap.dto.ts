import { DateField, UUIDField } from "@cocrepo/decorator";

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
