import type { CreateReservationCommandInput } from "@cocrepo/input";

export class CreateReservationCommand implements CreateReservationCommandInput {
	readonly timelineId!: CreateReservationCommandInput["timelineId"];
	readonly sessionId!: CreateReservationCommandInput["sessionId"];
	readonly programId!: CreateReservationCommandInput["programId"];
	readonly occurrenceStartAt!: CreateReservationCommandInput["occurrenceStartAt"];
	readonly idempotencyKey!: CreateReservationCommandInput["idempotencyKey"];
	readonly memo?: CreateReservationCommandInput["memo"];

	constructor(input: CreateReservationCommandInput) {
		Object.assign(this, input);
	}
}
