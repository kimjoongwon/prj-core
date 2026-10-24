import { ReservationAggregate } from "@cocrepo/aggregate";
import { CreateReservationCommand } from "@cocrepo/command";
import { ReservationCreatedEvent } from "@cocrepo/event";
import { CommandHandler, EventBus } from "@nestjs/cqrs";
import { ReservationUseCaseContext } from "./reservation-context";
import { toReservationCreatedEventPayload } from "./reservation-created-event-payload.mapper";

@CommandHandler(CreateReservationCommand)
export class CreateReservationUseCase {
	constructor(
		private readonly reservationService: ReservationAggregate,
		private readonly context: ReservationUseCaseContext,
		private readonly eventBus: EventBus,
	) {}

	async execute(command: CreateReservationCommand): Promise<unknown> {
		const context = this.context.requireContext();
		const input = command;

		const createResult = await this.reservationService.createWithResult({
			spaceId: context.spaceId,
			userId: context.userId,
			input: {
				idempotencyKey: input.idempotencyKey,
				memo: input.memo ?? null,
				occurrenceStartAt: input.occurrenceStartAt,
				programId: input.programId,
				sessionId: input.sessionId,
				timelineId: input.timelineId,
			},
		});

		if (createResult.created) {
			this.eventBus.publish(
				new ReservationCreatedEvent(
					toReservationCreatedEventPayload({
						reservation: createResult.reservation,
						occurredAt: new Date(),
					}),
				),
			);
		}

		return createResult.reservation;
	}
}
