export interface BookingFeedInput {
	spaceId: bigint;
	userId: bigint;
	from?: Date;
	to?: Date;
	timelineId?: bigint;
	programId?: bigint;
	search?: string;
	skip?: number;
	take?: number;
}
