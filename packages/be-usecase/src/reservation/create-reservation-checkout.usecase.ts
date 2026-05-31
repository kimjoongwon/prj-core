import { ReservationAggregateRoot } from "@cocrepo/aggregate";
import { CreateReservationCheckoutCommand } from "@cocrepo/command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ReservationUseCaseContext } from "./reservation-context";

@CommandHandler(CreateReservationCheckoutCommand)
export class CreateReservationCheckoutUseCase
	implements ICommandHandler<CreateReservationCheckoutCommand>
{
	constructor(
		private readonly reservationService: ReservationAggregateRoot,
		private readonly context: ReservationUseCaseContext,
	) {}

	async execute(command: CreateReservationCheckoutCommand): Promise<unknown> {
		const context = this.context.requireContext();
		const params = command.params;

		return this.reservationService.checkout({
			spaceId: context.spaceId,
			userId: context.userId,
			courseOfferingId: params.courseOfferingId,
			idempotencyKey: params.idempotencyKey,
			memo: params.memo ?? null,
			occurrenceStartAt: params.occurrenceStartAt,
			paymentMethod: params.paymentMethod,
			programId: params.programId,
			sessionId: params.sessionId,
			timelineId: params.timelineId,
		});
	}
}
