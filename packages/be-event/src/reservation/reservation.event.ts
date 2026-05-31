export interface ReservationCreatedEventParams {
	reservationId: string;
	userId: string;
	spaceId: string;
	timelineId: string;
	sessionId: string;
	programId: string;
	occurredAt: Date;
}

export class ReservationCreatedEvent {
	constructor(readonly params: ReservationCreatedEventParams) {}
}
