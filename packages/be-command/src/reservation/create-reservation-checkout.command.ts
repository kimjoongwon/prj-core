import type { CreateReservationCheckoutCommandInput } from "@cocrepo/input";

export class CreateReservationCheckoutCommand implements CreateReservationCheckoutCommandInput {
	readonly courseOfferingId!: CreateReservationCheckoutCommandInput["courseOfferingId"];
	readonly timelineId!: CreateReservationCheckoutCommandInput["timelineId"];
	readonly sessionId!: CreateReservationCheckoutCommandInput["sessionId"];
	readonly programId!: CreateReservationCheckoutCommandInput["programId"];
	readonly occurrenceStartAt!: CreateReservationCheckoutCommandInput["occurrenceStartAt"];
	readonly idempotencyKey!: CreateReservationCheckoutCommandInput["idempotencyKey"];
	readonly paymentMethod!: CreateReservationCheckoutCommandInput["paymentMethod"];
	readonly memo?: CreateReservationCheckoutCommandInput["memo"];

	constructor(input: CreateReservationCheckoutCommandInput) {
		Object.assign(this, input);
	}
}
