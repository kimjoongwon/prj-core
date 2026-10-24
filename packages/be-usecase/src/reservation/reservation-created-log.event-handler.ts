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
					userSeq: string;
					spaceSeq: string;
				};
			}
		).payload;

		this.logger.debug(
			`Reservation created: reservationId=${payload.reservationId}, userSeq=${payload.userSeq}, spaceSeq=${payload.spaceSeq}`,
		);
	}
}
