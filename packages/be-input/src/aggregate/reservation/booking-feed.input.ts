export interface BookingFeedInput {
	spaceSeq: bigint;
	userSeq: bigint;
	from?: Date;
	to?: Date;
	timelineSeq?: bigint;
	programSeq?: bigint;
	search?: string;
	skip?: number;
	take?: number;
}
