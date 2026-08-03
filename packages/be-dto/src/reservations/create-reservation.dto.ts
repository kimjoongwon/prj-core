import {
	BigIntIdField,
	DateField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

export class CreateReservationDto {
	@BigIntIdField({ description: "타임라인 ID" })
	timelineId!: bigint;

	@BigIntIdField({ description: "세션 ID" })
	sessionId!: bigint;

	@BigIntIdField({ description: "프로그램 ID" })
	programId!: bigint;

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
