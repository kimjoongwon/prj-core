import type { BookingFeedItemDto } from "@cocrepo/dto";

export const RESERVATION_AVAILABILITY = {
	AVAILABLE: "AVAILABLE" as BookingFeedItemDto["availabilityStatus"],
	FEW_LEFT: "FEW_LEFT" as BookingFeedItemDto["availabilityStatus"],
	WAITLIST_OPEN: "WAITLIST_OPEN" as BookingFeedItemDto["availabilityStatus"],
	RESERVED: "RESERVED" as BookingFeedItemDto["availabilityStatus"],
	WAITLISTED: "WAITLISTED" as BookingFeedItemDto["availabilityStatus"],
	BOOKING_CLOSED: "BOOKING_CLOSED" as BookingFeedItemDto["availabilityStatus"],
} as const;
