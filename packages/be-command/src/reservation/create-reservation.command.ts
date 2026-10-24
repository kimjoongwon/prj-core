import type { CreateReservationCommandInput } from "@cocrepo/input";

export class CreateReservationCommand implements CreateReservationCommandInput {
	readonly timelineSeq!: CreateReservationCommandInput["timelineSeq"];
	readonly sessionSeq!: CreateReservationCommandInput["sessionSeq"];
	readonly programSeq!: CreateReservationCommandInput["programSeq"];
	readonly occurrenceStartAt!: CreateReservationCommandInput["occurrenceStartAt"];
	readonly idempotencyKey!: CreateReservationCommandInput["idempotencyKey"];
	readonly memo?: CreateReservationCommandInput["memo"];

	constructor(input: CreateReservationCommandInput) {
		Object.assign(this, input);
	}
}
