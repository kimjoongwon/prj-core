export * from "./create-reservation.usecase";
export * from "./get-my-reservations.usecase";
export * from "./get-reservation-booking-feed.usecase";
export * from "./reservation-context";
export * from "./reservation-created-log.event-handler";

import { CreateReservationUseCase } from "./create-reservation.usecase";
import { GetMyReservationsUseCase } from "./get-my-reservations.usecase";
import { GetReservationBookingFeedUseCase } from "./get-reservation-booking-feed.usecase";
import { ReservationUseCaseContext } from "./reservation-context";
import { ReservationCreatedLogHandler } from "./reservation-created-log.event-handler";

export const ReservationCommandHandlers = [CreateReservationUseCase];

export const ReservationQueryHandlers = [
	GetMyReservationsUseCase,
	GetReservationBookingFeedUseCase,
];

export const ReservationEventHandlers = [ReservationCreatedLogHandler];

export const ReservationSagas = [];

export const ReservationUseCaseProviders = [
	ReservationUseCaseContext,
	...ReservationCommandHandlers,
	...ReservationQueryHandlers,
	...ReservationEventHandlers,
	...ReservationSagas,
];
