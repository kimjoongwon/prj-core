import { ReservationAvailabilityStatus } from "./reservation-availability-status";

export const RESERVATION_AVAILABILITY = {
	AVAILABLE: ReservationAvailabilityStatus.AVAILABLE,
	FEW_LEFT: ReservationAvailabilityStatus.FEW_LEFT,
	WAITLIST_OPEN: ReservationAvailabilityStatus.WAITLIST_OPEN,
	RESERVED: ReservationAvailabilityStatus.RESERVED,
	WAITLISTED: ReservationAvailabilityStatus.WAITLISTED,
	BOOKING_CLOSED: ReservationAvailabilityStatus.BOOKING_CLOSED,
} as const;
