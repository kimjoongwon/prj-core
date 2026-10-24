import type { GetReservationBookingFeedQueryInput } from "@cocrepo/input";

export class GetReservationBookingFeedQuery
	implements GetReservationBookingFeedQueryInput
{
	readonly dateFrom?: GetReservationBookingFeedQueryInput["dateFrom"];
	readonly dateTo?: GetReservationBookingFeedQueryInput["dateTo"];
	readonly timelineId?: GetReservationBookingFeedQueryInput["timelineId"];
	readonly programId?: GetReservationBookingFeedQueryInput["programId"];
	readonly search?: GetReservationBookingFeedQueryInput["search"];
	readonly skip?: GetReservationBookingFeedQueryInput["skip"];
	readonly take?: GetReservationBookingFeedQueryInput["take"];

	constructor(input: GetReservationBookingFeedQueryInput) {
		Object.assign(this, input);
	}
}
