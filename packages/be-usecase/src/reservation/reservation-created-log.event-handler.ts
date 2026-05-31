import { ReservationCreatedEvent } from "@cocrepo/event";
import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

@EventsHandler(ReservationCreatedEvent)
export class ReservationCreatedLogHandler
	implements IEventHandler<ReservationCreatedEvent>
{
	private readonly logger = new Logger(ReservationCreatedLogHandler.name);

	handle(event: ReservationCreatedEvent): void {
		this.logger.debug(
			`Reservation created: reservationId=${event.params.reservationId}, userId=${event.params.userId}, spaceId=${event.params.spaceId}`,
		);
	}
}
