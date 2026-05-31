export interface GetReservationBookingFeedQueryParams {
	dateFrom?: Date;
	dateTo?: Date;
	timelineId?: string;
	programId?: string;
	search?: string;
	skip?: number;
	take?: number;
}
