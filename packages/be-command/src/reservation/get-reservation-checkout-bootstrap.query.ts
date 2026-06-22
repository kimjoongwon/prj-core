import type { GetReservationCheckoutBootstrapQueryInput } from "@cocrepo/input";

export class GetReservationCheckoutBootstrapQuery implements GetReservationCheckoutBootstrapQueryInput {
	readonly timelineId!: GetReservationCheckoutBootstrapQueryInput["timelineId"];
	readonly sessionId!: GetReservationCheckoutBootstrapQueryInput["sessionId"];
	readonly programId!: GetReservationCheckoutBootstrapQueryInput["programId"];
	readonly occurrenceStartAt!: GetReservationCheckoutBootstrapQueryInput["occurrenceStartAt"];

	constructor(input: GetReservationCheckoutBootstrapQueryInput) {
		Object.assign(this, input);
	}
}
