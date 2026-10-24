export interface GetReservationBookingFeedQueryInput {
	dateFrom?: Date;
	dateTo?: Date;
	timelineId?: string;
	programId?: string;
	search?: string;
	skip?: number;
	take?: number;
}
