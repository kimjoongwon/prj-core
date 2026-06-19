export interface CreateReservationCheckoutCommandInput {
	courseOfferingId: string;
	timelineId: string;
	sessionId: string;
	programId: string;
	occurrenceStartAt: Date;
	idempotencyKey: string;
	paymentMethod: any;
	memo?: string | null;
}
