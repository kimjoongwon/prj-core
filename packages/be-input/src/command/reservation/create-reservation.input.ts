export interface CreateReservationCommandInput {
	timelineId: bigint;
	sessionId: bigint;
	programId: bigint;
	occurrenceStartAt: Date;
	idempotencyKey: string;
	memo?: string | null;
}
