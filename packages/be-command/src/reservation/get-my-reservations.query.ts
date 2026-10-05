import type { GetMyReservationsQueryInput } from "@cocrepo/input";

export class GetMyReservationsQuery implements GetMyReservationsQueryInput {
	readonly from?: GetMyReservationsQueryInput["from"];
	readonly to?: GetMyReservationsQueryInput["to"];
	readonly status?: GetMyReservationsQueryInput["status"];
	readonly skip?: GetMyReservationsQueryInput["skip"];
	readonly take?: GetMyReservationsQueryInput["take"];

	constructor(input: GetMyReservationsQueryInput) {
		Object.assign(this, input);
	}
}
