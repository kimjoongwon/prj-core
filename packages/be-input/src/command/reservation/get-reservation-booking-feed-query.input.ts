export interface GetReservationBookingFeedQueryInput {
	dateFrom?: Date;
	dateTo?: Date;
	timelineId?: bigint;
	programId?: bigint;
	search?: string;
	skip?: number;
	take?: number;
}
