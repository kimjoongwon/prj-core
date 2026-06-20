import { ReservationAggregate } from "@cocrepo/aggregate";
import { CreateReservationCheckoutCommand } from "@cocrepo/command";
import { CommandHandler } from "@nestjs/cqrs";
import { ReservationUseCaseContext } from "./reservation-context";

@CommandHandler(CreateReservationCheckoutCommand)
export class CreateReservationCheckoutUseCase {
	constructor(
		private readonly reservationService: ReservationAggregate,
		private readonly context: ReservationUseCaseContext,
	) {}

	async execute(command: CreateReservationCheckoutCommand): Promise<unknown> {
		const context = this.context.requireContext();
		const input = command.input;

		return this.reservationService.checkout({
			spaceId: context.spaceId,
			userId: context.userId,
			courseOfferingId: input.courseOfferingId,
			idempotencyKey: input.idempotencyKey,
			memo: input.memo ?? null,
			occurrenceStartAt: input.occurrenceStartAt,
			paymentMethod: input.paymentMethod,
			programId: input.programId,
			sessionId: input.sessionId,
			timelineId: input.timelineId,
		});
	}
}
