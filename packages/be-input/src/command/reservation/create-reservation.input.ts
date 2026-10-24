export interface CreateReservationCommandInput {
	timelineSeq: bigint;
	sessionSeq: bigint;
	programSeq: bigint;
	occurrenceStartAt: Date;
	idempotencyKey: string;
	memo?: string | null;
}
