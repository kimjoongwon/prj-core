import type { Reservation } from "@cocrepo/entity";

export interface ReservationCreateResult {
	created: boolean;
	reservation: Reservation;
}
