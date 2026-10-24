export interface GetReservationBookingFeedQueryInput {
	dateFrom?: Date;
	dateTo?: Date;
	timelineSeq?: bigint;
	programSeq?: bigint;
	search?: string;
	skip?: number;
	take?: number;
}
