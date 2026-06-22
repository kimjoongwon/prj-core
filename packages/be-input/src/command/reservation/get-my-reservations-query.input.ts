import type { ReservationStatus } from "@cocrepo/prisma";

export interface GetMyReservationsQueryInput {
	from?: Date;
	to?: Date;
	status?: ReservationStatus;
	skip?: number;
	take?: number;
}
