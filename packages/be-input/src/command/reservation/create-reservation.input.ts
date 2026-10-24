export interface CreateReservationCommandInput {
	timelineId: string;
	sessionId: string;
	programId: string;
	occurrenceStartAt: Date;
	idempotencyKey: string;
	memo?: string | null;
}
