export * from "./create-reservation.usecase";
export * from "./create-reservation-checkout.usecase";
export * from "./get-my-reservations.usecase";
export * from "./get-reservation-booking-feed.usecase";
export * from "./get-reservation-checkout-bootstrap.usecase";
export * from "./reservation-context";
export * from "./reservation-created-log.event-handler";

import { CreateReservationUseCase } from "./create-reservation.usecase";
import { CreateReservationCheckoutUseCase } from "./create-reservation-checkout.usecase";
import { GetMyReservationsUseCase } from "./get-my-reservations.usecase";
import { GetReservationBookingFeedUseCase } from "./get-reservation-booking-feed.usecase";
import { GetReservationCheckoutBootstrapUseCase } from "./get-reservation-checkout-bootstrap.usecase";
import { ReservationUseCaseContext } from "./reservation-context";
import { ReservationCreatedLogHandler } from "./reservation-created-log.event-handler";

export const ReservationCommandHandlers = [
	CreateReservationCheckoutUseCase,
	CreateReservationUseCase,
];

export const ReservationQueryHandlers = [
	GetMyReservationsUseCase,
	GetReservationBookingFeedUseCase,
	GetReservationCheckoutBootstrapUseCase,
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
