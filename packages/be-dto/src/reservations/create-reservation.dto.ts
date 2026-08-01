import {
	DateField,
	StringField,
	StringFieldOptional,
	ULIDField,
} from "@cocrepo/decorator";

export class CreateReservationDto {
	@ULIDField({ description: "타임라인 ID" })
	timelineId!: string;

	@ULIDField({ description: "세션 ID" })
	sessionId!: string;

	@ULIDField({ description: "프로그램 ID" })
	programId!: string;

	@DateField({ description: "예약 발생 회차 시작 시각" })
	occurrenceStartAt!: Date;

	@StringField({
		description: "멱등성 키",
		minLength: 8,
		maxLength: 120,
	})
	idempotencyKey!: string;

	@StringFieldOptional({
		description: "예약 메모",
		maxLength: 1000,
		nullable: true,
	})
	memo?: string | null;
}
