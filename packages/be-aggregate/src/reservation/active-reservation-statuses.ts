import { ReservationStatus } from "@cocrepo/prisma";

export const ACTIVE_RESERVATION_STATUSES: readonly ReservationStatus[] = [
	ReservationStatus.CONFIRMED,
	ReservationStatus.WAITLISTED,
];
