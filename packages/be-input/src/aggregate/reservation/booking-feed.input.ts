export interface BookingFeedInput {
	spaceId: string;
	userId: string;
	from?: Date;
	to?: Date;
	timelineId?: string;
	programId?: string;
	search?: string;
	skip?: number;
	take?: number;
}
