export interface CreateReservationCommandInput {
	coursePassId?: string;
	timelineId: string;
	sessionId: string;
	programId: string;
	occurrenceStartAt: Date;
	idempotencyKey: string;
	memo?: string | null;
}
