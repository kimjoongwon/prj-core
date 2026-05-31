import type { ReservationStatus } from "@cocrepo/prisma";

export interface GetMyReservationsQueryParams {
	from?: Date;
	to?: Date;
	status?: ReservationStatus;
	skip?: number;
	take?: number;
}
