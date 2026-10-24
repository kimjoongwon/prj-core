import { ReservationAggregate } from "@cocrepo/aggregate";
import { GetReservationBookingFeedQuery } from "@cocrepo/command";
import { buildOffsetPaginatedResponse } from "@cocrepo/toolkit";
import type { OffsetPaginatedResponse } from "@cocrepo/type";
import { QueryHandler } from "@nestjs/cqrs";
import { ReservationUseCaseContext } from "./reservation-context";

@QueryHandler(GetReservationBookingFeedQuery)
export class GetReservationBookingFeedUseCase {
	constructor(
		private readonly reservationService: ReservationAggregate,
		private readonly context: ReservationUseCaseContext,
	) {}

	async execute(
		query: GetReservationBookingFeedQuery,
	): Promise<OffsetPaginatedResponse<unknown[]>> {
		const context = this.context.requireContext();
		const params = query;
		const skip = params.skip ?? 0;
		const take = params.take ?? 50;
		const result = await this.reservationService.getBookingFeed({
			spaceSeq: context.spaceSeq,
			userSeq: context.userSeq,
			from: params.dateFrom,
			to: params.dateTo,
			timelineSeq: params.timelineSeq,
			programSeq: params.programSeq,
			search: params.search,
			skip,
			take,
		});

		return buildOffsetPaginatedResponse(
			result.items,
			result.totalCount,
			skip,
			take,
		);
	}
}
