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
			spaceSeq: context.spaceSeq,
			userSeq: context.userSeq,
			input: {
				idempotencyKey: input.idempotencyKey,
				memo: input.memo ?? null,
				occurrenceStartAt: input.occurrenceStartAt,
				programSeq: input.programSeq,
				sessionSeq: input.sessionSeq,
				timelineSeq: input.timelineSeq,
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
