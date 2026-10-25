import { StringFieldOptional, ULIDField } from "@cocrepo/decorator/field";

export class CreateReservationDto {
	@ULIDField({ description: "타임라인 공개 ID (ULID)" })
	timelineId!: string;

	@ULIDField({ description: "세션 공개 ID (ULID)" })
	sessionId!: string;

	@ULIDField({ description: "프로그램 공개 ID (ULID)" })
	programId!: string;

	@ULIDField({ description: "예약 시작 시각 (ISO 8601)" })
	occurrenceStartAt!: Date;
	@ULIDField({
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
