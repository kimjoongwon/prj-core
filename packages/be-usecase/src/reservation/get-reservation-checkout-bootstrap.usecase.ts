import { ReservationAggregate } from "@cocrepo/aggregate";
import { GetReservationCheckoutBootstrapQuery } from "@cocrepo/command";
import { QueryHandler } from "@nestjs/cqrs";
import { ReservationUseCaseContext } from "./reservation-context";

@QueryHandler(GetReservationCheckoutBootstrapQuery)
export class GetReservationCheckoutBootstrapUseCase {
	constructor(
		private readonly reservationService: ReservationAggregate,
		private readonly context: ReservationUseCaseContext,
	) {}

	execute(query: GetReservationCheckoutBootstrapQuery): Promise<unknown> {
		const context = this.context.requireContext();
		const params = query.params;

		return this.reservationService.getCheckoutBootstrap({
			spaceId: context.spaceId,
			userId: context.userId,
			occurrenceStartAt: params.occurrenceStartAt,
			programId: params.programId,
			sessionId: params.sessionId,
			timelineId: params.timelineId,
		});
	}
}
