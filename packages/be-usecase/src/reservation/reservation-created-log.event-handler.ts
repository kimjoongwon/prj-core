import { ReservationCreatedEvent } from "@cocrepo/event";
import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

@EventsHandler(ReservationCreatedEvent)
export class ReservationCreatedLogHandler
	implements IEventHandler<ReservationCreatedEvent>
{
	private readonly logger = new Logger(ReservationCreatedLogHandler.name);

	handle(event: ReservationCreatedEvent): void {
		const payload = (
			event as ReservationCreatedEvent & {
				payload: {
					reservationId: string;
					userId: string;
					spaceId: string;
				};
			}
		).payload;

		this.logger.debug(
			`Reservation created: reservationId=${payload.reservationId}, userId=${payload.userId}, spaceId=${payload.spaceId}`,
		);
	}
}
