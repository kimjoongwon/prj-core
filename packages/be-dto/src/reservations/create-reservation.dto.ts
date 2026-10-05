import { StringField, StringFieldOptional } from "@cocrepo/decorator/field";
import { Reservation } from "@cocrepo/entity";
import { PickType } from "@nestjs/swagger";

export class CreateReservationDto extends PickType(Reservation, [
	"timelineId",
	"sessionId",
	"programId",
	"occurrenceStartAt",
] as const) {
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
