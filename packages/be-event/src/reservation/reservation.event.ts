import type { ReservationCreatedEventPayload } from "./reservation-created.payload";

/**
 * ReservationCreated event.
 */
export class ReservationCreatedEvent {
	/**
	 * CQRS 이벤트 페이로드.
	 */
	readonly payload: ReservationCreatedEventPayload;

	constructor(payload: ReservationCreatedEventPayload) {
		this.payload = payload;
	}
}
